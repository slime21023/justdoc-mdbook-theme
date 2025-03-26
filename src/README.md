# Just Docs Theme for mdBook

Welcome to the Just Docs theme for mdBook, inspired by the popular "Just the Docs" Jekyll theme. This theme provides a clean, responsive documentation site with features designed to make documentation easy to use and navigate.

## Features

This theme includes several features that make it ideal for documentation:

- **Responsive design** - Looks great on both desktop and mobile devices
- **Collapsible navigation** - Organize your documentation with nested sections
- **Dark mode support** - Toggle between light and dark mode
- **Search functionality** - Find content quickly with the built-in search
- **Clean typography** - Easy to read with well-designed typography

## Getting Started

To use this theme in your own mdBook project:

1. Copy the `theme` directory to your project
2. Add the following to your `book.toml`:

```toml
[book]
title = "Your Book Title"
authors = ["Your Name"]

[output.html]
theme = "theme"
```

## Code Examples

Here's an example of syntax highlighting for code blocks:

```rust
fn main() {
    println!("Hello, Just Docs Theme!");
    
    // A more complex example
    let numbers = vec![1, 2, 3, 4, 5];
    let doubled: Vec<i32> = numbers.iter()
        .map(|x| x * 2)
        .collect();
    
    println!("Doubled numbers: {:?}", doubled);
}
```

## Tables

Tables are styled cleanly for better readability:

| Feature | Description | Supported |
|---------|-------------|-----------|
| Dark Mode | Toggle between light and dark themes | ✓ |
| Search | Find content in the documentation | ✓ |
| Responsive | Works on mobile and desktop | ✓ |
| Nested Nav | Organize with collapsible sections | ✓ |

## Blockquotes and Callouts

> **Note:** This theme includes styling for blockquotes to make important information stand out in your documentation.

## Next Steps

Continue exploring the theme by checking out [Chapter 1](chapter_1.md) for more examples.
