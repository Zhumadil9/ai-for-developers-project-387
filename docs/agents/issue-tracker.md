# Issue tracker: GitHub

Issues and specs for this repo live in GitHub Issues:
`Zhumadil9/ai-for-developers-project-387`.

Use `gh` for issue operations:

- Create: `gh issue create --title "..." --body "..."`
- Read: `gh issue view <number> --json number,title,body,labels,comments`
- List: `gh issue list --state open`
- Comment: `gh issue comment <number> --body "..."`
- Close: `gh issue close <number>`

When a skill says "publish to the issue tracker", create a GitHub issue.
Skills use native issue dependencies when available; otherwise they fall back to
`Blocked by: #<n>` in the issue body.

Pull requests are not a triage surface.
