import logging
import asyncio
from fastapi import APIRouter, Request, HTTPException, Query
from fastapi.responses import StreamingResponse

def safe_next(iterator):
    try:
        return next(iterator)
    except StopIteration:
        return None

from utils.prompts import CHILD_SYSTEM, PARENT_SYSTEM, STORY_SYSTEM
from utils.schemas import ChildChatRequest, ParentChatRequest

logger = logging.getLogger('smartchild.chat')
router = APIRouter()

async def run_generation(loader, messages, max_new_tokens, temperature, disable_lora=False):
    return await asyncio.to_thread(
        loader.generate,
        messages=messages,
        max_new_tokens=max_new_tokens,
        temperature=temperature,
        disable_lora=disable_lora
    )

@router.post("/child")
async def child_chat(
    req: ChildChatRequest, 
    request: Request,
    stream: bool = Query(False, description="Enable SSE streaming")
):
    is_story = "story" in req.message.lower()

    if is_story:
        system_prompt = STORY_SYSTEM.format(name=req.childName, age=req.age)
        max_tokens = min(request.app.state.MAX_NEW_TOKENS * 2, 350)
        temp = 0.3
        user_msg = f"{req.message} (Make it a safe, age-appropriate story. You MUST explicitly end the story by giving a piece of advice or moral lesson for the child, such as 'Always listen to your family' or similar.)"
    else:
        system_prompt = CHILD_SYSTEM.format(name=req.childName, age=req.age)
        max_tokens = min(request.app.state.MAX_NEW_TOKENS, 80)
        temp = request.app.state.TEMPERATURE
        user_msg = req.message

    messages = [{'role': 'system', 'content': system_prompt}]
    messages += req.get_clean_history()
    messages += [{'role': 'user', 'content': user_msg}]

    loader = request.app.state.model_loader

    if stream:
        async def event_generator():
            try:
                iterator = iter(loader.generate_stream(messages, max_new_tokens=max_tokens, temperature=temp, disable_lora=is_story))
                while True:
                    token = await asyncio.to_thread(safe_next, iterator)
                    if token is None:
                        break
                    if token:
                        yield f"data: {token}\n\n"
            except Exception as e:
                logger.error(f'Stream error: {e}', exc_info=True)
                yield f"data: [ERROR]\n\n"
            finally:
                yield "data: [DONE]\n\n"
        
        headers = {
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
        return StreamingResponse(event_generator(), media_type="text/event-stream", headers=headers)
    else:
        try:
            reply = await run_generation(loader, messages, max_tokens, temp, disable_lora=is_story)
            return {
                'reply': reply,
                'mode': 'child',
            }
        except Exception as e:
            logger.error(f'Child chat error: {e}', exc_info=True)
            raise HTTPException(status_code=500, detail="Generation failed")

@router.post("/parent")
async def parent_chat(
    req: ParentChatRequest, 
    request: Request,
    stream: bool = Query(False, description="Enable SSE streaming")
):
    system_prompt = PARENT_SYSTEM.format(
        name=req.childName,
        age=req.age,
        report=req.report,
        child_history=req.get_clean_child_history()
    )

    messages = [{'role': 'system', 'content': system_prompt}]
    messages += req.get_clean_history()
    messages += [{'role': 'user', 'content': req.message}]

    loader = request.app.state.model_loader
    max_tokens = request.app.state.MAX_NEW_TOKENS
    temp = request.app.state.TEMPERATURE

    if stream:
        async def event_generator():
            try:
                iterator = iter(loader.generate_stream(messages, max_new_tokens=max_tokens, temperature=temp))
                while True:
                    token = await asyncio.to_thread(safe_next, iterator)
                    if token is None:
                        break
                    if token:
                        yield f"data: {token}\n\n"
            except Exception as e:
                logger.error(f'Stream error: {e}', exc_info=True)
                yield f"data: [ERROR]\n\n"
            finally:
                yield "data: [DONE]\n\n"
                
        headers = {
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
        return StreamingResponse(event_generator(), media_type="text/event-stream", headers=headers)
    else:
        try:
            reply = await run_generation(loader, messages, max_tokens, temp)
            return {
                'reply': reply,
                'mode': 'parent',
            }
        except Exception as e:
            logger.error(f'Parent chat error: {e}', exc_info=True)
            raise HTTPException(status_code=500, detail="Generation failed")
