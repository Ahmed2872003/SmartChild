import nbformat

with open('SmartChild_Chatbot_FineTuning.ipynb', 'r', encoding='utf-8') as f:
    nb = nbformat.read(f, as_version=4)

with open('nb_dump.py', 'w', encoding='utf-8') as f:
    for i, cell in enumerate(nb.cells):
        if cell.cell_type == 'code':
            f.write(f"# CELL {i}\n")
            f.write(cell.source)
            f.write("\n\n")
