# CSS Preprocessors Cheat Sheet

---

# What is a CSS Preprocessor?

A CSS preprocessor is basically a tool that makes writing CSS easier and more organized. It adds extra features like variables, mixins, nesting, and partials that normal CSS doesn’t have.

You write the code in something like SCSS, and then it gets **compiled into regular CSS** so the browser can read it.

Some common ones are:

* Sass (most common)
* Less
* Stylus

---

# Compiling

## Description

Compiling just means converting SCSS into normal CSS.

Browsers can’t read SCSS, so it has to be compiled first.

## Example

### SCSS file

```scss
$color: blue;

h1 {
  color: $color;
}
```

### Compiled CSS

```css
h1 {
  color: blue;
}
```

---

# Variables

## Description

Variables let you store values like colors, sizes, spacing, etc.

This makes it easier because if you want to change something later, you only change it once.

## Example

```scss
$primary-color: #3498db;
$padding: 10px;

button {
  background: $primary-color;
  padding: $padding;
}
```

---

# Mixins

## Description

Mixins are used to reuse blocks of code so you don’t have to keep rewriting the same thing.

## Example

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  @include flex-center;
}
```

## Mixins with inputs

```scss
@mixin box($color) {
  background: $color;
}

div {
  @include box(red);
}
```

---

# Nesting

## Description

Nesting lets you write CSS inside other CSS. It matches how HTML is structured and makes it easier to read.

## Normal CSS

```css
nav ul li a {
  color: blue;
}
```

## SCSS version

```scss
nav {
  ul {
    li {
      a {
        color: blue;
      }
    }
  }
}
```

---

# Partials

## Description

Partials are just separate SCSS files used to keep things organized.

They start with an underscore.

Example:

```
_variables.scss
_header.scss
_footer.scss
```

Then you import them into the main file.

## Example

```scss
@import "variables";
@import "header";
@import "footer";
```

---

# Example Folder Layout

```
styles/
   main.scss
   _variables.scss
   _layout.scss
   _buttons.scss

css/
   main.css
```

---

# Workflow Summary

Basic idea:

1. Write code in SCSS
2. Compile it into CSS
3. Browser reads the CSS

---

# Why use preprocessors?

They help because:

* Less repeated code
* Easier to organize
* Easier to change stuff later
* Cleaner looking code
* Faster to work with

---

# Example showing why variables help

## Without variables

```css
button {
  background: blue;
}

.card button {
  background: blue;
}
```

## With variables

```scss
$primary: blue;

button {
  background: $primary;
}

.card button {
  background: $primary;
}
```

Now if you change the variable, everything updates.

---

# Short summary definition

CSS preprocessors make CSS easier to write by adding features like variables, mixins, nesting, and partials. The SCSS gets compiled into normal CSS that the browser can read. It helps keep code organized and easier to manage.

---

End of Cheat Sheet
