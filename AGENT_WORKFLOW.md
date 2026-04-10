# AGENT_WORKFLOW

## Tools Used
- GitHub Copilot (Chat): architecture planning, refactors, and boilerplate.
- VS Code integrated terminal: quick smoke tests and server run.

## Prompts and Iterations
- "Refactor frontend to hexagonal structure with domain/ports/usecases and update pages to spec."
- "Align backend endpoints with frontend contract and add ports/adapters."
- "Run smoke tests against endpoints and summarize responses."

## What Was Automated vs Manual
- Automated: scaffolding for ports, use-cases, adapters, and routers; data mapping; page refactors.
- Manual: verification of endpoints vs UI contract; review of pooling and banking rules.

## Validation Steps
- Started backend server.
- Hit endpoints: /routes, /routes/comparison, /compliance/cb, /compliance/adjusted-cb, /banking/bank, /banking/apply, /banking/records, /pools.
- Compared responses to frontend expectations and adjusted adapters.

## Notes
- SQLite retained per request.
- Database seed may require reset for clean data when validating results.
