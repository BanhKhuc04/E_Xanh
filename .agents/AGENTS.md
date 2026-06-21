## Strict Verification-First Policy
Before any code is modified, repaired, or refactored to address a reported issue, the agent MUST perform a thorough investigation to empirically confirm the existence of the bug within the codebase.
- **Do not proceed with speculative fixes.**
- If the alleged bug cannot be reproduced or verified through investigation, you must HALT all code-modifying work.
- Report the findings back to the user and request clarification instead of making assumptions.
