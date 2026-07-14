# Agent Execution & Context Retention Rules

You are an autonomous agent operating within this codebase. To ensure continuity, seamless handoffs to future agents, and absolute uniformity in architecture and design, you **must** strictly adhere to the following logging, execution, and style protocols.

---

## 1. The Core Mandate: Memory & Context Continuity
Before you write, modify, or delete a single line of code, or when you begin a new session/task, you must document your intent and actions in the `CONTEXT_LOG.md` file located at the root of the project. If this file does not exist, create it immediately.

## 2. Trigger Events for Logging
You must update `CONTEXT_LOG.md` under the following conditions:
*   **Initialization:** When you begin a new task or sub-task.
*   **Implementation:** When adding new features, files, or dependencies.
*   **Modification:** When altering existing logic, refactoring, or fixing bugs.
*   **Deletion:** When removing code, assets, or deprecating features.
*   **Pivot/Interruption:** If a strategy fails and you must switch approaches mid-task.

---

## 3. Log Entry Schema
Every entry in `CONTEXT_LOG.md` must append to the **top** of the file (reverse chronological order) using the following exact Markdown structure:

### [YYYY-MM-DD HH:MM] - Task: [Short Task Title]
*   **Status:** [Initiated | In Progress | Completed | Failed]
*   **Phase:** [Pre-Execution Planning | Post-Execution Summary]
*   **Objective/Context:** 
    *   *What are we trying to achieve? Why is this change necessary?*
*   **Files Added/Modified:**
    *   `path/to/file.ext` - [Brief description of changes]
*   **Files/Code Removed:**
    *   `path/to/old_file.ext` - [Reason for removal/deprecation]
*   **Architectural Decisions & Working Patterns:**
    *   *Explain the "Why" behind the implementation choices, patterns used, or constraints discovered.*
*   **Next Steps / Open Items for Future Agents:**
    *   *What needs to be done next? What should the next agent watch out for?*

---

## 4. Execution Workflow (Step-by-Step)

### Step 1: Pre-Execution Log & Verification
1. Read the existing `CONTEXT_LOG.md` to understand recent state changes.
2. If the task involves UI, UX, frontend layout, or styling, you **must read the files inside the `/design` directory first** (see Section 5).
3. Formulate your plan and write a **Pre-Execution** log entry detailing what you are *about* to do and *why*.

### Step 2: Code Execution
1. Perform the necessary file modifications, creations, or deletions.
2. Test your changes to ensure stability.

### Step 3: Post-Execution Log
1. Update your previous log entry or append a **Post-Execution** summary.
2. Explicitly detail exactly what changed, what was removed, and any new architectural patterns established.
3. Outline clear instructions for the next agent who inherits this state.

---

## 5. Design System & Styling Constraints
All visual rules, theme specifications, and global style states are strictly modularized. Do not hardcode magic numbers, custom colors, or arbitrary layouts.

*   **The Design Authority:** All fundamental design rules, UX frameworks, and structural guidelines live inside the `/design` directory, specifically within `design/design.md`. 
*   **Style Tokens & CSS Variables:** Global styles, themes, and CSS variables are managed entirely within the `/design` folder. 
*   **Compliance Rule:** Before writing any markup, CSS, components, or UI adjustments, you must inspect the `/design` folder to import or utilize the pre-established CSS variables and layout principles. If a required variable or rule is missing, document the gap in your `CONTEXT_LOG.md` before creating it.

---

## 6. Enforcement & Constraints
*   **No Stealth Changes:** Do not modify any file without documenting it in the log first or immediately after.
*   **Atomic Logs:** Keep log updates tied tightly to the specific feature or fix you are working on.
*   **Absolute Honesty:** If an implementation choice was a quick workaround due to a limitation, document it. Do not hide technical debt from future agents.