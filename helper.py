import os

# Project root folder
root_dir = r"C:\Users\Admin\PycharmProjects\LCDsim\frontend"

# File extensions you want to include
code_extensions = ['.js', '.jsx', '.css', '.html']

# Output file
output_file = "frontend_code_export.txt"

with open(output_file, "w", encoding="utf-8") as out:
    for subdir, dirs, files in os.walk(root_dir):
        # Skip node_modules folder
        if 'node_modules' in dirs:
            dirs.remove('node_modules')

        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in code_extensions:
                file_path = os.path.join(subdir, file)
                rel_path = os.path.relpath(file_path, root_dir)
                out.write(f"\n\n===== {rel_path} =====\n\n")
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        out.write(f.read())
                except Exception as e:
                    out.write(f"\n[Error reading file: {e}]\n")

print(f"All frontend code exported to {output_file}")
