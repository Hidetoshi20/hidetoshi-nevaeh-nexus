---
trigger: always_on
---

# Recipe Book Management Rules

This document outlines the rules and conventions for managing the `docs/recipe-book/` directory. All agents and contributors must follow these guidelines to maintain a clean and organized recipe collection.

## 1. Directory Structure

The recipe book is organized by dish category. The root `docs/recipe-book/` contains global indices and configuration files.

- **Root Files**:
  - `README.md`: The main entry point, containing the directory tree, statistics, and quick links.
  - `cooking-tips.md`, `diet-preferences.md`, `recipe-format.md`: Global reference documents.
- **Category Folders**:
  - Each major category gets its own folder (e.g., `noodle-dishes/`, `meat-dishes/`, `cold-dishes/`).
  - **Naming**: Use **kebab-case** in English for folder names (e.g., `stir-fry-dishes`).

## 2. Category Folder Content

Each category folder MUST contain:

1.  **`README.md`**: An index file listing all fully documented recipes in that category. It should also link to the `menu.md` if present.
2.  **`menu.md`** (Optional but recommended): A checklist file for "To-Do" recipes or simple lists of dishes that haven't been fully documented yet.
3.  **Recipe Files**: Individual Markdown files for each dish.

## 3. File Naming & Content

- **Recipe Filenames**: Can be in Chinese or English. Keep them descriptive (e.g., `新疆家常拌面.md` or `uyghur-laghman.md`).
- **Dietary Restrictions**:
  - **STRICTLY NO PORK**. The collection focuses on Halal and Xinjiang-style cuisine.
  - Primary meats: Beef, Lamb/Mutton, Chicken.
- **Recipe Format**:
  - Follow the template defined in `docs/recipe-book/recipe-format.md`.
  - Include tags if applicable (e.g., `#spicy`, `#noodle`).

## 4. Workflow for Adding Recipes

When adding a new recipe:

1.  **Identify Category**: Choose the most appropriate subdirectory. If a new category is needed, create the folder, a `README.md`, and a `menu.md`.
2.  **Create File**: Create the `.md` file in the chosen folder.
3.  **Update Indices**:
    - Add a link to the new file in the **category's `README.md`**.
    - If the dish was previously listed in `menu.md`, update that entry (link it or mark as done).
    - (Optional) If it's a major addition, update the statistics table in `docs/recipe-book/README.md`.
4.  **Verify**: Ensure relative links work correctly.

## 5. Maintenance

- Periodically review `menu.md` files to see which recipes need detailed documentation.
- Ensure the "Classification Statistics" table in the main README reflects the current state of the directory.
