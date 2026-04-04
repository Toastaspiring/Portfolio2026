---
title: "Markdown Stress Test"
date: 2026-04-04
tags: [test, markdown, debug]
excerpt: "Testing every markdown feature to find what breaks."
---

## Headings

### H3 heading

#### H4 heading

## Text formatting

This is **bold text** and this is *italic text* and this is ***bold italic***. Here's some ~~strikethrough~~ text. And some `inline code` too.

## Links

Here's an [internal link](#/) and an [external link](https://github.com) that should open in a new tab.

## Lists

### Unordered list

- First item
- Second item with **bold**
- Third item
  - Nested item A
  - Nested item B
- Fourth item

### Ordered list

1. Step one
2. Step two
3. Step three
   1. Sub-step
   2. Another sub-step

## Blockquote

> This is a blockquote. It should look distinct from regular text.
> It can span multiple lines.

> Nested quote with `code` and **bold** inside.

## Code blocks

```python
def train_model(data, epochs=10):
    """Train a simple model."""
    model = NeuralNetwork(layers=[128, 64, 32])
    for epoch in range(epochs):
        loss = model.fit(data)
        print(f"Epoch {epoch}: loss={loss:.4f}")
    return model
```

```javascript
const fetchData = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};
```

```bash
docker build -t myapp .
docker run -p 8080:8080 myapp
```

## Table

| Feature | Status | Notes |
|---------|--------|-------|
| Bold | Working | `**text**` |
| Italic | Working | `*text*` |
| Code | Working | backticks |
| Links | TBD | check external |

## Images

![Octocat](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)

## Horizontal rule

Some text above the rule.

---

Some text below the rule.

## Inline HTML edge case

This paragraph has <em>inline HTML emphasis</em> and a <strong>strong tag</strong>.

## Long paragraph

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## Mixed content

Here's a paragraph with **bold**, *italic*, `code`, and a [link](https://example.com) all in one sentence. Then a list:

- Item with `code`
- Item with [a link](https://example.com)
- Item with **bold** and *italic*

> And a quote right after a list.

```python
# And code right after a quote
x = 42
```

## End

If you see this, the full post rendered without crashing.
