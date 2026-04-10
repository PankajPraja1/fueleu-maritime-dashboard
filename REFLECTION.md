# Reflection

Using AI agents accelerated the conversion to a hexagonal architecture and helped generate consistent ports/adapters across frontend and backend. The biggest gains were in repetitive scaffolding (types, repositories, routers) and fast alignment with the API contract. Manual review was still required to ensure domain rules (CB math, pooling constraints) matched the spec and that the UI behaviors aligned with backend responses.

If I repeated this, I would add tests earlier and use the agent to draft test cases alongside each use-case. I would also standardize response shapes sooner to avoid extra normalization logic in the frontend adapter. Overall, agent assistance saved time and reduced boilerplate, but correctness checks still needed focused attention.
