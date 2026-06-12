import json

with open('SmartChild_Chatbot_FineTuning.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for i, cell in enumerate(nb['cells']):
    source = "".join(cell.get('source', []))
    print(f"Cell {i} ({cell['cell_type']}):")
    # Print the first line or a summary to identify
    lines = source.split('\n')
    print("  " + lines[0][:80] if lines else "  [Empty]")
    if "push_to_hub" in source:
        print("  -> CONTAINS PUSH_TO_HUB")
    if "Clean Texts" in source or "unicodedata" in source:
        print("  -> CONTAINS PREPROCESSING")
