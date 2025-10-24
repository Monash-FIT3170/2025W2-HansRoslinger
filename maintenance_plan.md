MAINTENANCE PLAN

As a team of students, we will continue to develop, maintain, and improve this application over future semesters. Our goal is to keep it stable, secure, and easy for the next group to take over — ensuring smooth transitions, predictable updates, and sustainable practices.
 
Purpose
- Keep the application running smoothly and securely on modern infrastructure.
- Maintain affordable hosting and storage costs.
- Support semester-to-semester handovers with minimal friction and no knowledge loss.
- Document key processes so future contributors can get started quickly.

Roles
- Product Lead - manages priorities, tasks, and communication with supervisors or stakeholders.
- Tech Lead - oversees architecture, reviews schema or code changes, and maintains system health.
- Infrastructure Manager - maintains access to Vercel, AWS, and GitHub; handles backups and secrets.
- Documentation Owner - keeps README, setup guides, and changelogs updated.
(One person may handle multiple roles depending on the semester.)
Documentation and Source of Truth

We will keep all essential project knowledge in the GitHub repository.
- README - setup, run, and deployment instructions.
- Architecture Overview - explains the main modules, data flow, and integrations (Next.js, Prisma, AWS).
- Decision Records (ADRs) - short notes for important technical choices.
- Runbooks - step-by-step guides for migrations, rollbacks, and onboarding.
- CHANGELOG - clear notes for each release.

Development and Deployment
- Work in short-lived feature branches and merge through pull requests.
- Each PR must pass CI checks and at least one peer review.
- Merging to “main” triggers automatic production deployment through Vercel.
- Prisma migrations handle all database changes - no manual edits.
- Preview deployments are generated automatically for PRs.
- Rollbacks can be done by reverting the last merge and redeploying.

Access and Security
- Use school emails for GitHub, Vercel, and AWS accounts.
- Enable two-factor authentication for all team members.
- Only the Infrastructure Manager holds admin privileges.
- Rotate API keys and passwords every semester.
- Remove access immediately when a member leaves the team.

Tooling and Dependencies
- Standardize Node, TypeScript, and Prisma versions in documentation.
- Use Dependabot or Renovate for automated dependency updates.
- Review patch and minor updates weekly; review major updates each semester.
- Run “npm audit” monthly and resolve all high-severity issues promptly.

Testing and CI/CD
- Run type-checking, linting, and unit tests in CI before merging.
- Smoke test the main user flows after each deployment.
- Only release when all checks pass and documentation is updated.

Monitoring and Backups
- Use Vercel analytics and uptime monitoring to detect outages.
- Store function logs in Vercel and AWS.
- Automate daily database snapshots and verify restore tests monthly.
- Apply lifecycle rules on AWS buckets to reduce storage costs over time.
Handover and Continuity

At the end of each semester, the team will:
- Update documentation, decision records, and runbooks.
- Rotate credentials and confirm all access removals.
- Record a 30-minute “system walkthrough” for the next team.
- Summarize open issues and the current roadmap.

Onboarding New Members
- Read the README and architecture overview.
- Set up the local environment and confirm the app runs correctly.
- Gain access to GitHub, Vercel, and AWS.
- Submit a small pull request within the first week to learn the workflow.

Risk Management
- Keep architecture diagrams and ADRs updated to reduce key-person dependency.
- Test every database migration on staging before production deployment.
- Rotate credentials immediately if any secret is exposed.
- Periodically test monitoring alerts and rollback procedures.

End of Project - If the project is ever discontinued:
- Archive the repository in read-only mode to preserve all source history.
- Permanently delete all customer data in compliance with privacy requirements.
- Decommission all paid infrastructure and revoke any remaining user or admin access.
