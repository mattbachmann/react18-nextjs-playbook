<!-- TOC -->
* [Introduction to React](#introduction-to-react)
    * [JSX vs html](#jsx-vs-html)
    * [Tooling](#tooling)
    * [Styling in NextJS](#styling-in-nextjs)
    * [Props](#props)
        * [Setting props with spread operator](#setting-props-with-spread-operator)
        * [Props inside map function](#props-inside-map-function)
    * [Hooks and State](#hooks-and-state)
        * [useState Hook for change detection](#usestate-hook-for-change-detection)
        * [useEffect hook for fetching data initially and adding or removing event listeners](#useeffect-hook-for-fetching-data-initially-and-adding-or-removing-event-listeners)
        * [useRef hook as element reference](#useref-hook-as-element-reference)
        * [Custom hook for api calls and loadingState](#custom-hook-for-api-calls-and-loadingstate)
    * [Conditional rendering](#conditional-rendering)
    * [Disabling Controls](#disabling-controls)
    * [React.Context](#reactcontext)
    * [Forms](#forms)
* [Working with Components React 18](#working-with-components-react-18)
    * [Next.js Toolchain](#nextjs-toolchain)
    * [Higher Order Components (HOCs)](#higher-order-components-hocs)
    * [React Developer Tools](#react-developer-tools)
        * [Components tab](#components-tab)
        * [Profiler tab](#profiler-tab)
            * [Profile page load](#profile-page-load)
            * [Profile a single action](#profile-a-single-action)
        * [Error boundaries](#error-boundaries)
    * [Rendering performance optimization](#rendering-performance-optimization)
        * [React.memo](#reactmemo)
        * [Debouncing / useDeferredValue](#debouncing--usedeferredvalue)
        * [Prioritizing updates / useTransition](#prioritizing-updates--usetransition)
    * [Server components / SSR](#server-components--ssr)
* [Class Components](#class-components)
* [React Router](#react-router)
    * [Handling 404s](#handling-404s)
* [Running example projects](#running-example-projects)
    * [Get older Nodejs Version, install and start app](#get-older-nodejs-version-install-and-start-app)
    * [Fix SSL-error for http://localhost:3000](#fix-ssl-error-for-httplocalhost3000)
* [Managing Form State and Validation](#managing-form-state-and-validation)
    * [State Management Guidelines](#state-management-guidelines)
    * [Web storage](#web-storage)
    * [Form state and validation](#form-state-and-validation)
    * [Managing complex state with useReducer](#managing-complex-state-with-usereducer)
    * [React Context for sharing state](#react-context-for-sharing-state)
    * [3rd Party Libraries for State management](#3rd-party-libraries-for-state-management)
<!-- TOC -->

# Introduction to React

## JSX vs html

* JSX translates to `React.createElement` calls with babel.js
* JSX `className` instead class, because `class` is reserved in JS
* JSX {/* comment */} instead <!-- comment -->

````js
const Greeting = () => (
        <div>
          <Banner/>
          <h2 className="highlight"> Greetings!</h2>
        </div>
);
````

## Tooling

* NextJS or CreateReactApp as CLI
* For NextJS:
    * root component _app.js and index.js start page

## Props
* All input props given from parent component go into props object param
```jsx
<HouseRow house={h} />
```
```jsx
const HouseRow = ({ house }) => (
        <div> {house.address} <div>
          );
```

### Setting props with spread operator

```jsx
const houseResponse = {address: "1st Street", zip: "1234", town: "Garfield"};
<HouseRow {...houseResponse} />
```

Use destructoring, to only access properties, that are required:

```jsx
const HouseRow = ({ address, zip, town }) => (
        <div> {house.address} <div>
          );
```


### Props inside map function
Need to provide a key prop for tracking:
```jsx
  {houses.map((h) => (
        /* key property for tracking - needed for components in map fn */
        <HouseRow key={h.id} house={h} />
))}
```

Another example with an html-select:
````jsx
<select id="size" value={sku} onChange={(e) => setSku(e.target.value)}>
        <option value="">What size?</option>
        {product.skus.map((s) => (
                <option key={s.sku} value={s.sku}>
                  {s.size}
                </option>
        ))}
</select>
````

## Hooks and State
* In general React lifecyle hooks or custom hooks

### useState Hook for change detection
```jsx
const houseArray = [
  {
    id: 1,
    address: "12 Valley of Kings, Geneva",
    country: "Switzerland",
    price: 900000,
  },
        ...
];

const HouseList = () => {
  const [houses, setHouses] = useState(houseArray);
  ...
```
* setHouses should always be used to change houses
* Always call useState hook at the start of the component function.
* Never call `useState` conditionally
* Always provide _new_ array in `setHouses`
* Components can change their state, but not props they receive. (no double data binding)
    * Only 1 way data binding

```js
const addHouse = () => {
    setHouses([
      ...houses,
      {
        id: 3,
        address: "32 Valley Way, New York",
        country: "USA",
        price: 1000000,
      },
    ]);
  };
```

An example of an onChange-handler using setSize state function:

````jsx
      <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
````

For state updates in child components pass `setSelectedHouse` function to a child using a wrapper function:

```jsx
const App = () => {
  const [selectedHouse, setSelectedHouse] = useState();

  const setSelectedHouseWrapper = (house) => {
    //do checks on
    setSelectedHouse(house);
  };

  return (
          <>
            <Banner>
              <div>Providing houses all over the world</div>
            </Banner>
            {selectedHouse ? (
                    <House house={selectedHouse} />
            ) : (
                    <HouseList selectHouse={setSelectedHouseWrapper} />
            )}
          </>
  );
};

```

### Three rules of hooks

* Only use hooks (useState, useEffect) in a _functional_ componenent or in a custom hook, but not in a _class-component_!
* Only on the top level of the component function or custom hook, not in a helper function!
* Never call hooks conditionally!

### useEffect hook for fetching data initially and adding or removing event listeners

Provide empty deps array as 2nd parameter to only fetch initially and not on every change.

```js

// Component function and useEffect are run initially AND on every state change
useEffect(() => {
  const fetchHouses = async () => {
    const response = await api.getHouses();
    setHouses(response.json);
  };

  fetchHouses(); // Cannot make async calls directly in useEffect

  window.addEventListener('unhandledRejection', handler);

  return () => { // function returned is called on destruction
    window.removeEventListener('unhandledRejection', handler);
  };
}, []); // Only fetch initially, by providing empty deps []
```

Another example logging every change of a state variable:

```jsx
const [text1, setText1] = useState("First");
const [text2, setText2] = useState("Last");

useEffect(() => {
    console.log('text1', text1);
    console.log('text2', text2);

    return () => {
        console.log('cleanup called after every change');
    };
}, [text1, text2]);
```

### useRef hook as element reference

Refs are useful for:
* element reference
* to preserve unrendered state between renders like previous value

Example for an element reference:

```js

const incBtnRef = useRef(null);

return (
        <> {/* empty container */}
         ...
          <button className="btn" 
                  ref={incBtnRef} // setting the element reference with ref attribute
                  onClick={() => {
                      const val = incBtnRef.current.value; // reading from ref - current is html element
                      
                  }}>
            Increment
          </button>
        </>
);
```

Another example that changes the element's style. Also a counter that does not cause rerender:

````jsx
import { useRef, useState } from "react";
export default function Demo() {

  // case #1 reference DOM
  const imgRef = useRef();
  // case #2 reference value that does not cause re-render
  const mouseOverCnt = useRef(0);
  const [cnt, setCnt] = useState(0);
  return (
    <div className="container">
      <img src="/images/Speaker-1124.jpg"
        ref={imgRef}
        style={{ filter: "grayscale(100%)" }}
        onMouseOver={() => {
          imgRef.current.style.filter = "grayscale(0%)";setCnt(cnt+1)
          mouseOverCnt.current++;
        }}
        onMouseOut={() => {
          imgRef.current.style.filter = "grayscale(100%)";
        }}
      />
      <hr />
      <button
        onClick={() => {
          alert("Registered! mouseOverCnt:" + mouseOverCnt.current);
        }}
      >
        Register
      </button>
    </div>
  );
}

````

### Custom hook for api calls and loadingState

In general custom hooks start with `use` and are defined in their own file like here `useGetRequest.js`.

```jsx
import { useCallback, useState } from "react";

const loadingStatus = {
  loaded: "loaded",
  isLoading: "Loading...",
  hasErrored: "An error occured while loading",
};

const useGetRequest = (url) => {
  const [loadingState, setLoadingState] = useState(loadingStatus.isLoading);

  const get = useCallback(async () => { // useCallback to avoid an infinite loop
    setLoadingState(loadingStatus.isLoading);
    try {
      const rsp = await fetch(url);
      const result = await rsp.json();
      setLoadingState(loadingStatus.loaded);
      return result;
    } catch {
      setLoadingState(loadingStatus.hasErrored);
    }
  }, [url]); 
  return { get, loadingState };
};

export default useGetRequest;
```

Every usage of a custom hook creates an isolated instance. When using `useGetRequest` in `useEffect` the `get` method must be put into the deps array.
Therefore `useGetRequest` has the useCallback hook in it, to avoid an endless fetching loop.

```jsx
const [houses, setHouses] = useState([]);
const { get, loadingState } = useGetRequest("/api/houses");

useEffect(() => {
  const fetchHouses = async () => {
    const houses = await get();
    setHouses(houses);
  };
  fetchHouses();
}, [get]); // dependent on get
```

A different loading hook example:

````jsx
import { useState, useEffect } from "react";

const baseUrl = process.env.REACT_APP_API_BASE_URL; // env variable for base path

export default function useFetch(url) { // Can be called to make REST calls with different urls
  const isMounted = useRef(false); // too check if component is still mounted (not destroyed)
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isMounted.current = true; // init isMounted when starting useEffect
      
    async function init() { // must declare async functions inside useEffecte
      try {
        const response = await fetch(baseUrl + url);
        if (response.ok) {
          const json = await response.json();
          if (isMounted.current) setData(json); // check if component mounted, then setData
        } else {
          throw response;
        }
      } catch (e) {
        if (isMounted.current) setError(e); // check if component mounted, then setError
      } finally {
        if (isMounted.current) setLoading(false); // check if component mounted, then setLoading
      }
    }
    
    init();

    return () => { // cleanup function, that will set isMounted to false
      isMounted.current = false;
    };
  }, [url]); // will be run once for every different url

  return { data, error, loading };
}

````

Consuming the `useFetch` hook:

````jsx

export default function App() {
  const [size, setSize] = useState("");

  const { data: products, loading, error } = useFetch(
          "products?category=shoes"
  );
````

## Conditional rendering

JS logic evaluated for className:

```jsx
<div className={`${house.price >= 500000 ? "text-primary" : ""}`}>
```

Only render an element if house.price is truthy:

```jsx
return (
        <tr onClick={() => selectHouse(house)}>
          <td>{house.address}</td>
          
          {house.price && (
                  <td >
                    {currencyFormatter.format(house.price)}
                  </td>
          )}
          
        </tr>
);
```

## Disabling Controls

Based on the state of `sku` disable a button:

````jsx
const [sku, setSku] = useState("");
...
 <button 
         disabled={!sku}
...
````

## React.Context

Avoid having to pass state down to children. Refer to [React Context for sharing state](#react-context-for-sharing-state).

## Forms

`useState` hook and `onChange` handler on an input element.

````jsx
const Bids = ({ house }) => {
    const { bids, loadingState, addBid } = useBids(house.id);

    const emptyBid = {
        houseId: house.id,
        bidder: "",
        amount: 0,
    };

    const [newBid, setNewBid] = useState(emptyBid); // initial state

    if (loadingState !== loadingStatus.loaded)
        return <LoadingIndicator loadingState={loadingState} />;

    const onBidSubmitClick = () => {
        addBid(newBid);
        setNewBid(emptyBid);
    };

    return (
        <>
            <div className="row">
                <div className="col-5">
                    <input
                        id="bidder"
                        className="h-100"
                        type="text"
                        value={newBid.bidder}
                        onChange={(e) => setNewBid({ ...newBid, bidder: e.target.value })} {/* provide new object to set state */}
                        placeholder="Bidder"
                    ></input>
                </div>
                <div className="col-2">
                    <button className="btn btn-primary" onClick={onBidSubmitClick}>
                        Add
                    </button>
                </div>
            </div>
        </>
    );
};
````

# Working with Components React 18

## Higher Order Components (HOCs)

Pattern that uses a function that enhances a component:

```jsx
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

export const withTheme = (Component) => {
  function Func(props) {
    const { darkTheme, toggleTheme } = useContext(ThemeContext);
    return (
      <Component {...props} darkTheme={darkTheme} toggleTheme={toggleTheme} />
    );
  }
  return Func;
};
```

The enhanced component can use the props `darkTheme` and `toggleTheme`:

```jsx
import { withTheme } from "../hocs/withTheme";

const Header = ({ layoutVersion, darkTheme, toggleTheme }) => {
  return (
    <header>
      <h2>To-do List</h2>
      <span className="nav-item">
        <input
          type="checkbox"
          checked={darkTheme === true}
          className="theme-toggle-checkbox"
          autoComplete="off"
          id="toggleThemeId"
          onChange={() => {
            toggleTheme();
          }}
        />
        <label htmlFor="toggleThemeId" className="theme-toggle-checkbox-label">
          <i className="fas fa-moon"></i>
          <i className="fas fa-sun"></i>
          <span className="ball"></span>
        </label>
        <span>{layoutVersion}</span>
      </span>
    </header>
  );
};

export default withTheme(Header);
```

## React Developer Tools

2 new inspector tabs: components and profile.

### Components tab

Expand component by double-click.

Hitting the `<>` icon on the right will open the .js source map.

Because `useState` values are listed without the name, one can use:

```jsx
useDebugValue(`count1:${count1}`);
```

In some case custom React hooks could provide additional debugger output.


### Profiler tab

#### Profile page load

Select `Flamegraph` tab, hit reload button on the left side and then the stop recording button.

The graph shows rendering times for each rendered component.

#### Profile a single action

Hit record button. Change a TodoItem. Hit record button again to stop recording.

Now inspect which elements have been rerendered.

Hit settings button in the middle. For `Profiler` activate `Record why each component rendered while profiling`.

### Error boundaries

Run a prod build with `npm run build` and run `npm start`. See that runtime errors will not have useful messages.

Therefore error boundaries can provide help:

````jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
````

Now could wrap any component like App with ErrorBoundary e.g. in `index.js`:

````jsx

ReactDOM.render(
        <ErrorBoundary>
          <App />
        </ErrorBoundary>,
        document.getElementById("root")
);
````

Limitations:
* cannot catch errors in async code, event handlers, inside error boundary or in SSR components.

To handle async errors must add a catch and set an error state variable:
If error state variable is set, then throw error instead returning jsx:

````jsx
  if (error) throw error;
````

## Rendering performance optimization

In React when a parent component changes, all it's child components are also rerendered.

To improve performance for large data sets can use:
* `memo()` to cache pure function components unless their props values change
* `useMemo` hook to cache calculations between renders
* `useCallback` to cache function definitions between renders
* `useDeferredValue` for debouncing user input values

### React.memo

For rendering pure components, where the appearance only depends on their props values.

Simply wrap exported component in memo() function like this:

```jsx
import { memo } from "react";

function ToDoItemText({ important, todoText }) {
  return (
    <>
      {important ? (
        <span className="badge warning-bg">
          <i className="fa fa-exclamation-circle"></i>
        </span>
      ) : null}
      {todoText.slice(0, 60)}
    </>
  );
}

export default memo(ToDoItemText); // memo will only rerender if props values change
```

Also possible to provide a requiresRerender function as second parameter:

````jsx

export default memo(ToDo, (prevProps, nextProps) => {
  return !(
          prevProps.todoItem.completed != nextProps.todoItem.completed ||
          prevProps.todoItem.important != nextProps.todoItem.important ||
          prevProps.idUpdating === prevProps.todoItem.id ||
          nextProps.idUpdating === nextProps.todoItem.id
  );
});
````

### useMemo

`useMemo` hook to cache pure calculation functions between renders.

Pure means cannot use context or state inside those functions - the output must only depend on input params.

Example with a filter and sort hook `useSpeakerSortAndFilter.js` which is pure:

````jsx 
export default function useSpeakerSortAndFilter(
  speakerList,
  speakingSaturday,
  speakingSunday,
  searchText
) {
  console.log("useSpeakerSortAndFilter called");
  return speakerList
    ? speakerList
        .filter(
          ({ sat, sun }) => (speakingSaturday && sat) || (speakingSunday && sun)
        )
        .filter(({ firstName, lastName }) => {
          return (
            searchText.length === 0 ||
            (firstName?.toLowerCase() + lastName?.toLowerCase()).includes(
              searchText.toLowerCase()
            )
          );
        })
        .sort(function (a, b) {
          if (a.firstName < b.firstName) {
            return -1;
          }
          if (a.firstName > b.firstName) {
            return 1;
          }
          return 0;
        })
    : [];
}
````

Then can use `useMemo` in the calling component `SpeakersList.js`:

````jsx
export default function SpeakersList() {
    const { speakerList, loadingStatus } =
        useContext(SpeakersDataContext);
    const { speakingSaturday, speakingSunday, searchText } =
        useContext(SpeakerMenuContext);
    const speakerListJson = JSON.stringify(speakerList);
    const speakerListFiltered = useMemo( // call with anonymous function as 1st param
        () =>
            useSpeakerSortAndFilter(
                speakerList,
                speakingSaturday,
                speakingSunday,
                searchText
            ),
        [speakingSaturday, speakingSunday, searchText, // useMemo deps as 2nd param
            loadingStatus, speakerListJson], // speakerListJson needed so changes to speakers array are detected
    );
    ...
````

The speakerListJson is needed so changes to speakers array are detected. Ideally always provide new array when an entry changes.

### useCallback

If a parent component changes that can mean that it's functions also get redefined.

And when the function is passed to a child component, then the child needs to rerender - even when using `memo()`.

Therefore the function can be wrapped inside `useCallback` to keep it from getting redefined:

````jsx
 return (
    <SpeakerLine
        key={speakerRec.id}
        speakerRec={speakerRec}
        updating={updatingId === speakerRec.id ? updatingId : 0}
        toggleFavoriteSpeaker={useCallback( // useCallback
            () => toggleFavoriteSpeaker(speakerRec),
            [speakerRec.favorite] // useCallback deps
        )}
        highlight={highlight}
    />
);
````

### useDeferredValue (Debouncing)

If lots of search terms slow down the typing in search input, then can `useDeferredValue` for search term state to keep the input responsive.
Only needed for hundreds or thousands of list items. Works like debouncing.

```jsx
const App = () => {
  const [searchText, setSearchText] = useState("");
  const searchTextDeferred = useDeferredValue(searchText, { timeoutMs: 1000 });

  return (
          <TodosDataProvider>
            <Layout>
                <ToDoManager
                        displayStatus={displayStatus} important={important}
                        searchText={searchTextDeferred}
                />
            </Layout>
          </TodosDataProvider>
  );
};
export default App;
```

### useTransition (deprioritizing long-running tasks while showing progress)

Alternatively can use `useTransition`to get `isPending` and `startTransition` to debounce and show progress.
Then wrap call to low prio state-setter `setSearch` in `startTransition` to delay the update of the `search` text send to backend.
Use a different state hook for hi prio state like the visible `currentSearch` input text.

```jsx
function App() {
  const [search, setSearch] = useState(""); // state used for long running search task
  const [currentSearch, setCurrentSearch] = useState(""); // hi prio state for the current search text displayed in input
  const [isPending, startTransition] = useTransition(); // call startTransition to mark low prio task, isPending can be used for spinner
  const [todoList, setTodoList] = useState([
    "clean dog", "eat lunch", "wash clothes", "...",
  ]);

  return (
          <div>
            <input
                    value={currentSearch}
                    onChange={(e) => {
                      setCurrentSearch(e.target.value); // visible current search text is responsive
                      startTransition(() => setSearch(e.target.value)); // text used for long running search task is delayed
                    }}
            />
              {isPending ? "refreshing..." : ""}  {/* Progress indicator */}
              <ShowTodoList todoList={todoList} deferredSearch={search} />
          </div>
  );
}
```

## Server components / SSR

Instead of Todos REST call can get prerendered TodoListComponent from server for faster loading.
Downside is there cannot be browser events or local state in SSR components.
But ProviderContext exists.
Using NextJs App Router with /app/page.js root component:

```jsx
import 'server-only';
import React, { Suspense } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout//Footer';
import ImportantContextProvider from './contexts/ImportantContext';
import ToDoFilterToolbar from './components/todo/ToDoFilterToolbar';
import ToDoList from './components/todo/ToDoList';

export default function Page() {
  return (
    <>
      <Header />
      <ImportantContextProvider>
        <ToDoFilterToolbar />
        <Suspense fallback={<div>Loading... </div>}> {/* suspense wrapper for loading ToDoList */}
          <ToDoList />
        </Suspense>
      </ImportantContextProvider>
      <Footer />
    </>
  );
}
```

The context is a client side hook with `'use client';` at the top:

````jsx
'use client';
import { createContext, useContext, useState } from 'react';

export const ImportantContext = createContext();

export default function ImportantContextProvider({
  children,
}) {
  const [important, setImportant] = useState(false);
  return (
    <ImportantContext.Provider
      value={{ important, setImportant }}
    >
      {children}
    </ImportantContext.Provider>
  );
}

export const useImportantContext = () => {
  const value = useContext(ImportantContext);
  if (!value) {
    throw new Error(
      'useImportantContext must be used within an ' +
        'ImportantContextProvider',
    );
  }
  return value;
};
````

The ToDoList component is a server component using the `server-only` package:

````jsx
import "server-only";
import ToDoItem from "../../components/todo/ToDoItem";
import ToDoItemClient from
          "../../components/todo/ToDoItemClient";
const sleep = (ms) => new Promise((resolve) =>
        setTimeout(resolve, ms));

export default async function ToDoList() {
  const url = "http://localhost:3000/api/todos";
  const res = await fetch(url, {
    next: {
      revalidate: 0,
    },
  });
  const results = await res.json();
  const todoList = results;
  await sleep(2000);
  return (
          <div className="tasks">
            {todoList.map((toDo) => {
              return (
                      <ToDoItemClient toDo={toDo} key={toDo.id}>
                        <ToDoItem toDo={toDo} />
                      </ToDoItemClient>
              );
            })}
          </div>
  );
}
````

Since the child component ToDoItem is a client side component it is wrapped in a function called ToDoItemClient:

````jsx
'use client';

import { useImportantContext } from '../../contexts/ImportantContext';

export default function ToDoItemClient({ toDo, children }) {
  const { important } = useImportantContext();

  return important === false ? (
    <>{children}</>
  ) : toDo.important === true ? (
    <>{children}</>
  ) : null;
}
````

The function can access the client context state as well as the children passed in from the ToDoList server component.

# Class Components

Though functional components are recommended since React 16, class components still work!

Similar to Angular the class component has lifecycle hooks:

* componentDidMount (on init)
* componentDidUpdate (on change)
* componentWillUnmount (on destroy)
* shouldComponentUpdate

Simple example:

````jsx
class MyComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    // This is where you can perform initial setup.

    // In this example, we simulate fetching data from an API after the             component has mounted.
    // We use a setTimeout to mimic an asynchronous operation.
    setTimeout(() => {
      const fetchedData = 'This data was fetched after mounting.';
      this.setState({ data: fetchedData });
    }, 2000); // Simulate a 2-second delay
  }

  render() {
    return (
      <div>
        <h1>componentDidMount Example</h1>
        {this.state.data ? (
          <p>Data: {this.state.data}</p>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
    );
  }
}

export default MyComponent;
````

# React Router

Separate open source project. Not part of React. To use it can wrap `App` component in `BrowserRouter`:

```jsx
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById("root")
);
```

Then in `App.jsx` declare the routes:

```jsx
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
          <>
            <div className="content">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<h1>Welcome to Carved Rock Fitness</h1>} />
                  <Route path="/:category" element={<Products />} />
                  <Route path="/:category/:id" element={<Detail />} />
                  <Route path="/cart" element={<Cart />} />
                </Routes>
              </main>
            </div>
            <Footer />
          </>
  );
}
```

Read the path parameter `:category` in `Products.jsx` using `useParams` hook:

```jsx
 export default function Products() {
    const {category} = useParams();
    
}
```

Navigate to another page with Link or NavLink:

````jsx
import { Link, NavLink } from "react-router-dom";

const activeStyle = {
  color: "purple",
};

export default function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/">
                            <img alt="Carved Rock Fitness" src="/images/logo.png"/>
                        </Link>
                    </li>
                    <li>
                        <NavLink activeStyle={activeStyle} to="/shoes">
                            Shoes
                        </NavLink>
                    </li>
                    <li>
                        <NavLink activeStyle={activeStyle} to="/cart">
                            Cart
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    );
}
````

NavLink accepts an active style.

Programmatically redirect with `useNavigate`:

````jsx
    ...
    const navigate = useNavigate();
    ...
    <button className="btn btn-primary" onClick={() => navigate("/cart")}>
      Add to cart
    </button>
````

## Handling 404s

Just a simple component:

````jsx
import React from "react";

export default function PageNotFound() {
  return <h1>Page not found.</h1>;
}
````

So if API call has no results, can simply return it in an early return from `Products` component function:

````jsx
  if (products?.length === 0) return <PageNotFound />;
````

# Running example projects

Some projects written with an older React version like 16 require an older NodeJS version like 10.

### Get older Nodejs Version, install and start app

Install `nvm` and then exec `nvm install 10` and `nvm use 10`.

Then run the following commands:

```
node -v
npm install
npm start
```

### Fix SSL-error for http://localhost:3000

In chrome type: `chrome://net-internals/#hsts`

Click on `Domain Security Policy` on the Sidebar.

Under "Delete domain security policies" enter domain `localhost` and hit "Delete".

Now can open http://localhost:3000 in a new tab to test app.:-)

# Managing Form State and Validation

## State Management Guidelines

* Keep state local in component
* But if multiple components need the same state, then lift state to common parent component
    * provide child components with wrapper function around state setter
* Always use the function form to increment state
  ```jsx 
   setCount((count) => count + 1);
  ```
* Treat state objects as immutable, meaning always create a new object if it's props change
    * `const newState = Object.assign({}, oldState, { updatedProp: 'newValue' });`
    * `const newState = {...oldState, updatedProp: 'newValue'};`
    * `const newArr = [...oldArr, newEntry];`
    * Both only clone shallow - not nested objects
        * Best keep Objects apart instead of nesting, try to avoid deep cloning
    * Also use array transformer functions like `map, filter`

Example with addToCart:

````jsx
const [cart, setCart] = useState([]);

function addToCart(id) {
  setCart((items) => {
    const itemInCart = items.find((i) => i.id === id);
    if (itemInCart) {
      // Return new array with the matching item's quantity increased
      return items.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      // Return new array with the new item appended
      return [...items, { id, quantity: 1 }];
    }
  });
}
````

## Web storage

Only for:
* limited data
* not security relevant
* limited amounts of writes (to not block browser)
* Works only on one device

On `localStorage` can call `setItem, getItem and removeItem`.

Example with useEffect:

````jsx
export default function App() {
  // The function is evaluated lazily and will only run on initial render  
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) ?? [];
    } catch {
      console.error("The cart could not be parsed into JSON.");
      return [];
    }
  });

  // Everytime the cart dep changes, then store it in localStorage
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
````

## Form state and validation

Manage form status with a pseudo-enum STATUS and a single state variable status. SUBMITTED comes after user hits "submit".
Then validation will show errors below the inputs.
The purpose of SUBMITTING is to disable the "submit" button during validation and save.

```jsx
const STATUS = {
  IDLE: "IDLE",
  SUBMITTED: "SUBMITTED",
  SUBMITTING: "SUBMITTING",
  COMPLETED: "COMPLETED",
};

// Declaring outside component to avoid recreation on each render
const emptyAddress = {
  city: "",
  country: "",
};

export default function Checkout({ cart, emptyCart }) {
    const [address, setAddress] = useState(emptyAddress);
    const [status, setStatus] = useState(STATUS.IDLE);
    const [saveError, setSaveError] = useState(null);
    const [touched, setTouched] = useState({});

    // Validation - executed after every change:
    const errors = getErrors(address);
    const isValid = Object.keys(errors).length === 0;

    function getErrors(address) {
        const result = {};
        if (!address.city) result.city = "City is required";
        if (!address.country) result.country = "Country is required";
        return result;
    }

    function handleBlur(event) {
        event.persist(); // persist the event, otherwise would be garbage collected (React 17+ not required)
        setTouched((cur) => {
            return {...cur, [event.target.id]: true}; // then can use event.target.id as key
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setStatus(STATUS.SUBMITTING);
        if (isValid) {
            try {
                await saveShippingAddress(address);
                emptyCart();
                setStatus(STATUS.COMPLETED);
            } catch (e) {
                setSaveError(e);
            }
        } else {
            setStatus(STATUS.SUBMITTED);
        }
    }
}
````

Show error in returned markup:

````jsx
 <input
        id="city"
        type="text"
        value={address.city}
        onBlur={handleBlur}
        onChange={handleChange}
/>
<p role="alert">
  {(touched.city || status === STATUS.SUBMITTED) && errors.city}
</p>
````

## Managing complex state with useReducer

Instead of `useState` can also use `useReducer` to manage state with Redux.

````jsx
let initialCart;
try {
  initialCart = JSON.parse(localStorage.getItem("cart")) ?? [];
} catch {
  console.error("The cart could not be parsed into JSON.");
  initialCart = [];
}

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart); // cart state and dispatch returned

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  return (
          <>
            <div className="content">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<h1>Welcome to Carved Rock Fitness</h1>} />
                  <Route path="/:category" element={<Products />} />
                  <Route
                          path="/:category/:id"
                          element={<Detail dispatch={dispatch} />} // only need to pass dispatch
                  />
                  <Route
                          path="/cart"
                          element={<Cart cart={cart} dispatch={dispatch} />}
                  />
                  <Route
                          path="/checkout"
                          element={<Checkout cart={cart} dispatch={dispatch} />}
                  />
                </Routes>
              </main>
            </div>
            <Footer />
          </>
  );
}
````

Then can dispatch `action` object with an `action.type` of string plus additional payload if required.

````jsx
<select
              aria-label={`Select quantity for ${name} size ${size}`}
              onChange={(e) =>
                dispatch({
                  type: "updateQuantity",
                  sku,
                  quantity: parseInt(e.target.value),
                })
              }
              value={quantity}
            >
````

The `cartReducer` function can be put into its own file:

````jsx
export default function cartReducer(cart, action) {
  switch (action.type) {
    case "empty":
      return [];
    case "updateQuantity": {
      const { quantity, sku } = action;
      return quantity === 0
        ? cart.filter((i) => i.sku !== sku)
        : cart.map((i) => (i.sku === sku ? { ...i, quantity } : i));
    }
    case "add":
      const { id, sku } = action;
      const itemInCart = cart.find((i) => i.sku === sku);
      if (itemInCart) {
        // Return new array with the matching item replaced
        return cart.map((i) =>
          i.sku === sku ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // Return new array with the new item appended
        return [...cart, { id, sku, quantity: 1 }];
      }
    default:
      throw new Error("Unhandled action " + action.type);
  }
}
````

The returned value will replace the entire `cart` array so need to merge entries when required.

## React Context for sharing state

React Context is for large apps where lifting state (props drilling) is not advisable.

1) Context is declared with `const MyContext = React.createContext(null);`.

2) Then it is provided by wrapping child components inside `<MyContext.Provider value={{payload}}></MyContext.Provider>`.

3) Child components can then call `const {payload} = useContext(MyContext);` to consume the context and extract its payload.

An example where the shopping cart and dispatch function are shared with CartContext in `cartContext.js`:

````jsx
import React, {useContext, useEffect, useReducer} from "react";
import cartReducer from "./cartReducer";

// React Context declaration (not exported)
const CartContext = React.createContext(null);


let initialCart;
try {
  initialCart = JSON.parse(localStorage.getItem("cart")) ?? [];
} catch {
  console.error("The cart could not be parsed into JSON.");
  initialCart = [];
}
/**
 * CartProvider wrapper component to wrap App component in index.js
 * Also encapsulates the shared state/reducer
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export function CartProvider(props) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart); // shared state/reducer
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  return (
    <CartContext.Provider value={{cart, dispatch}}> {/*Context.Provider value contains object with shared props*/}
      {props.children} {/*children to which context is provided*/}
    </CartContext.Provider>
  );
}

/**
 * custom hook useCart
 * @returns {*} shared context object containing {cart, dispatch}
 */
export function useCart() {
  const context = useContext(CartContext); // useContext hook
  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider. Wrap a parent component in <CartProvider> to fix this error."
    );
  }
  return context;
}
````

The CartProvider component wraps the App component in `index.js`:
````jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ErrorBoundary from "./ErrorBoundary";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./cartContext";

ReactDOM.render(
  <ErrorBoundary>
    <BrowserRouter>
      <CartProvider> {/* provider */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById("root")
);
````

The context reference will force the component to rerender on any context change.

**So don't wrap your App component with a ContextProvider, unless you really have too!**

But better move it down the hierarchy.

Finally `useCart` can be called in `Cart.jsx`:

````jsx
import React from "react";
import useFetchAll from "./services/useFetchAll";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useCart } from "./cartContext";

export default function Cart() {
  const { cart, dispatch } = useCart(); // call useCart
  const navigate = useNavigate();
  const urls = cart.map((i) => `products/${i.id}`); // access cart
  const { data: products, loading, error } = useFetchAll(urls);
````


## 3rd Party Libraries for State management

* `Redux`, `Xstate` for more complex state transition logic
* `react-query` has support for caching and syncing frontend and backend
* `React Hook Form`, `Formik` for forms


# NextJS

Why NextJs: Has all the latest concurrent rendering features like `Suspense`. A NodeJS server is required for server rendered components.
Also NextAuth.js (Auth.js) offers simple JWT based authentication for NodeJS and React.

## Next.js Toolchain

`npx create-next-app@latest` without `App Router`. `next` dependency.
To run just exec `npm ci` and `npm run dev`.
`next.config.js` has config settings. `index.js` is root file and App.js root component.

NextJS with TS has `page.tsx` as start page.

If NextJS is used with SSR, then need to declare the boundary of the client side bundle using `'use client';` at the top of the root component file.
All other modules imported into it, including child components, are considered part of the client bundle.

## Styling in NextJS
* 4 global styling create a _document.js file, because NextJS has no index.html for style links
* Component styles, see components/banner.module.css
    * import {logo} from "./banner.module.css"
    * use className={logo} in JSX
* Inline
    * style={{color: red}} where inner braces are an object

## next/server REST API

Can use `next/server` to build NodeJS based REST API.

````jsx
import { NextRequest } from "next/server";
import { createSpeakerRecord, getSpeakers } from "@/lib/prisma/speaker-utils";

export async function GET(request: NextRequest) {
  const speakers = await getSpeakers(""); // call to SQL db mapped with PRISMA ORM

  return new Response(JSON.stringify(speakers, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: Request) {
    try {
        const data = await request.json();
        delete data.id; // let the database handle assigning the id
        delete data.favorite; // this will confuse prisma and it's virtual field

        const newSpeaker = await createSpeakerRecord(data);

        return new Response(JSON.stringify(newSpeaker, null, 2), {
            status: 201,
            headers: {
                // CORS headers
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error creating speaker" }), {
            status: 500,
        });
    }
}
````

## NextJS Server Actions

* Like RPC calls running on the server
* Best put into it's own file with "use server" at the start
* Like hooks actions have an upper case name
* When called from client all params must be primitives
* When called from client all params need to be validated!
* Can call server actions from server components
    * think of server components as GET and server actions as POST, PUT, DELETE

````jsx
"use server";

import prisma from "@/lib/prisma/prisma";
import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

export async function CheckEmailExistsAction(email: string): Promise<boolean> {
  await new Promise<void>((resolve) => setTimeout(resolve, 3000));
  const attendee = await prisma.attendee.findUnique({ // ORM framework prisma checking DB
    where: {
      email: email,
    },
  });
  return attendee !== null;
}
````

Example of usage on client:

````jsx
"use client"
import React, { ChangeEvent, useState, useTransition, useEffect } from "react";
import { FormDataType } from "@/app/server-action-example/page";
import { CheckEmailExistsAction } from "@/app/server-action-example/page-server-action";

export default function EmailInput({
                                       formData: { email },
                                       onChange,
                                   }: {
    formData: FormDataType;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
    const [emailInDatabase, setEmailInDatabase] = useState(false);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        setEmailInDatabase(false);
    }, [email]);

    const onBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const emailValue = event.target.value;
        startTransition(async () => {
            setEmailInDatabase(await CheckEmailExistsAction(emailValue));
        });
    };

    return (
        <div className="mb-3">
            <label htmlFor="email" className="form-label">
                Email Address
            </label>
            <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                onBlur={onBlur}
            />
            {emailInDatabase && (
                <div className="text-danger">Email address exists already</div>
            )}
            {pending && <div className="text-info">Checking email address...</div>}
        </div>
    );
}

````

Can also use ZOD runtime validation:

````jsx
import { z } from "zod";

const SpeakerSchema = z.object({
  id: z.number().optional(), // needed because we sometimes pass in no id to mean this gets added
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  company: z.string().optional(),
  twitterHandle: z.string().optional(),
  userBioShort: z.string().optional(),
  timeSpeaking: z.date(),
});

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export async function createSpeakerAction(speakerData: Speaker) {
  await sleep(1000);

  const validatedFields = SpeakerSchema.safeParse(speakerData);
  if (!validatedFields.success) {
    let errorMessage = "";
    validatedFields.error.issues.forEach(
      (issue) => (errorMessage += `${issue.path[0]}:${issue.message};`),
    );
    throw new Error(errorMessage);
  }

  return await createSpeakerRecord(speakerData);
}
````

# Styling React Apps

## UI component libraries

* MUI Material based with design system
* Radix - just UI components without design system

## Architecture

Different approaches:

* SMACSS
* ITCSS
* BEM

### BEM

Reusable Blocks, their elements and modifiers

## CSS libraries

* Bootstrap
* Tailwind
* Atomic CSS

# Testing React Components

Best integrate testing from the beginning. The sources are on the course page 'Testing in React 18' in pluralsight on the tab `exercise files`.

## Testing with NextJS and Jest

Create a new NextJS app with Jest test framework:

`npx create-next-app --example with-jest my-project`

### Testing with virtual browser (JsDom)

Can use Jest as test runner:

````jsx
import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />);

    const heading = screen.getByRole('heading', {
      name: /welcome to next\.js!/i,
    });

    expect(heading).toBeInTheDocument();
  });
});

````

Element query types:

* get, getAll
* query, queryAll
* find, findAll

Selector types:

*  ByRole
*  ByLabelText
*  ByPlaceholderText
*  ByText
*  ByDisplayValue
*  ByAltText
*  ByTitle
*  ByTestId

Text search can be done with regex. All methods should be called with async await.

Query type `get` will get exactly one, or else throw an exception:

````jsx
import { render, screen, getByRole, within } from '@testing-library/react'
import Home from '@/pages/index'

test('Home renders a heading nested', async () => {
  render(<Home/>);
  
  const main = await screen.getByRole('main');
  screen.debug('My test log', {});
  
  getByRole(main, 'heading', {
    name: "Filter List"
  });

  // or

  within(main).getByRole('heading', {
    name: "Filter List"
  });

});

````

Run tests with `npm run test`.

Mocking API calls with `jest.mock`:

````jsx
import { render, screen, queryAllByRole, getByText, fireEvent, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterList from '@/components/FilterList';
import * as api from '../api';

const listOfExoplanets = ['Kepler-22b', 'Kepler-452b', 'TrES-2b', 'Gliese 504 b'];

jest.mock('../api');
api.getPlanets.mockResolvedValue(listOfExoplanets);

describe('FilterList', () => {

  describe('interaction - user-events', () => {
    
    describe('filtering', () => {

      it('should filter by parts of words', async () => {
        const user = userEvent.setup();
        render(<FilterList onChange={ ()=>{} }/>);

        const filterInput = screen.getByPlaceholderText(/Filter/i);
        await user.type(filterInput, '5');
        expectOnlyItems([/Kepler-452b/i, /Gliese 504 b/i]);
      });
    });

...
````

# NextJS Playbook

