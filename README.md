# tweet-counter-static

This repository is related to the assignment given in the "[コンテンツ入門 (GA13501)](https://kdb.tsukuba.ac.jp/syllabi/2023/GA13501/jpn/)" course at the University of Tsukuba.

My approach to counting the number of tweets, including those with the hashtag ["`#コンテンツ入門2023`"](https://twitter.com/hashtag/%E3%82%B3%E3%83%B3%E3%83%86%E3%83%B3%E3%83%84%E5%85%A5%E9%96%802023) that one has posted.

## Stack

- [Bun](https://bun.sh/) - An all-in-one JavaScript runtime and ultra-fast package manager
- [Vite](https://vitejs.dev/) - Build tool and development server for modern web development
- [React](https://react.dev/) - The library for web and native user interfaces
- [React Bootstrap](https://react-bootstrap.netlify.app/) - React + Bootstrap UI components

## Requirements

This project requires the following to run:

- [Bun](https://bun.sh/) 1.0.7+

## Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `bun install`     | Installs dependencies                       |
| `bun run dev`     | Starts local dev server at `localhost:5173` |
| `bun run build`   | Build a production site to `./dist/`        |
| `bun run preview` | Preview a build locally, before deploying   |
| `bun run format`  | Format the code using Prettier              |
