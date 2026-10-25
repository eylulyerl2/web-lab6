# Assignment 6 – Post Dashboard

A React app built with Vite that fetches posts from JSONPlaceholder, shows loading, error and empty states, and filters posts by title.


## File Organization

```
/assignment6
├── public/
├── src/
│   ├── api/
│   │   └── postsApi.js       # fetchPosts(): data fetching only, no React or JSX
│   ├── components/
│   │   ├── Post.jsx          # Shows a single post (title + body), no state
│   │   ├── PostList.jsx      # Maps posts to <Post /> using post.id as key
│   │   └── FilterForm.jsx    # Controlled input for filtering by title
│   ├── reducer/
│   │   └── postsReducer.js   # Pure reducer: FETCH_START / FETCH_SUCCESS / FETCH_ERROR
│   ├── App.jsx               # Owns state, fetches on mount, derives filtered posts
│   └── main.jsx              # Entry point
├── index.html
├── package.json
└── vite.config.js
```

- **API layer** only gets data. It doesn't know anything about React.
- **Reducer** only describes how the state changes. No async code, no side effects.
- **App** connects everything: it fetches in `useEffect`, dispatches actions and passes data down as props.
- **Components** only render the props they receive.

## Challenges

**1. Blank page after adding the fetch logic.**
After connecting `App.jsx` to the API, the page was completely blank. The browser console said `postsApi.js` does not provide an export named `fetchPosts`. The file hadn't been saved properly, so the export was missing. I fixed it in a separate commit. I learned to check the console first when the page is blank.

**2. `fetch` doesn't throw on HTTP errors.**
`fetch` only rejects when the network fails. A 404 response still counts as "successful", so I check `response.ok` and throw an error myself. I tested this by changing the URL to a wrong one, and the app showed an error message instead of crashing.

**3. Cleaning up the effect.**
`StrictMode` runs effects twice in development, so without cleanup the posts would be requested twice. I used an `AbortController` and return `controller.abort()` from the effect. A cancelled request throws an `AbortError`, so I ignore it instead of showing it as an error.

**4. Filtering as derived state.**
I don't store the filtered posts in state. They are calculated during render from `posts` and `filter`, so there is only one source of data and nothing can get out of sync.

**5. Two kinds of "empty".**
"The API returned no posts" and "no posts match the filter" are different situations, so the app shows a different message for each.
