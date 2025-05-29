
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string[];
  category?: string;
  isAIGenerated?: boolean;
  aiModel?: string;
  generatedAt?: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with React and TypeScript",
    slug: "getting-started-with-react-typescript",
    date: "April 15, 2023",
    excerpt: "Learn how to set up a new React project with TypeScript and understand the basics of using TypeScript with React components.",
    content: [
      "React and TypeScript make a powerful combination for building robust web applications. TypeScript adds static type checking to JavaScript, helping catch errors before runtime and improving the developer experience with better tooling and code completion.",
      "To get started with React and TypeScript, you can use Create React App with the TypeScript template. Simply run: `npx create-react-app my-app --template typescript`",
      "This will set up a new React project with TypeScript configuration already in place. You'll notice that your component files use the .tsx extension instead of .jsx, and you can start defining types for your props and state.",
      "When defining a React component in TypeScript, you'll typically want to define an interface for its props. For example:",
      "```typescript\ninterface ButtonProps {\n  text: string;\n  onClick: () => void;\n  color?: 'primary' | 'secondary';\n}\n\nconst Button: React.FC<ButtonProps> = ({ text, onClick, color = 'primary' }) => {\n  return (\n    <button \n      onClick={onClick}\n      className={`btn btn-${color}`}\n    >\n      {text}\n    </button>\n  );\n};\n```",
      "Notice how the interface allows us to define which props are required (text, onClick) and which are optional (color). We can also define the exact types these props should be, even using union types like 'primary' | 'secondary' to restrict the possible values of color.",
      "TypeScript also works well with React hooks. For example, when using useState, TypeScript can often infer the type based on the initial value, but you can also explicitly specify the type:",
      "```typescript\nconst [count, setCount] = useState<number>(0);\n```",
      "As you continue working with React and TypeScript, you'll discover more advanced patterns like generic components, typing custom hooks, and using utility types. The combination of React's component model with TypeScript's type system creates a development experience that's both flexible and safe.",
    ]
  },
  {
    id: 2,
    title: "Building a Responsive UI with Tailwind CSS",
    slug: "building-responsive-ui-with-tailwind",
    date: "May 22, 2023",
    excerpt: "Discover how to create beautiful, responsive user interfaces quickly and efficiently using Tailwind CSS utility classes.",
    content: [
      "Tailwind CSS has revolutionized the way developers approach styling in web applications. Instead of writing custom CSS, Tailwind provides a comprehensive set of utility classes that you can apply directly in your HTML or JSX.",
      "One of Tailwind's greatest strengths is how easy it makes responsive design. Using breakpoint prefixes like sm:, md:, lg:, and xl:, you can control how your layout adapts to different screen sizes.",
      "For example, to create a grid that changes from a single column on mobile to two columns on medium screens and three columns on large screens, you'd write something like this:",
      "```html\n<div class=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4\">\n  <!-- Grid items here -->\n</div>\n```",
      "Tailwind also makes it easy to handle responsive typography, padding, margins, and more. For instance, you might want a heading to be smaller on mobile devices and larger on desktops:",
      "```html\n<h1 class=\"text-2xl md:text-3xl lg:text-4xl font-bold\">\n  Responsive Heading\n</h1>\n```",
      "The utility-first approach of Tailwind makes it incredibly fast to iterate on designs. You don't need to switch between files or come up with class names; you simply add the utility classes you need right where you need them.",
      "While some developers initially worry about the verbosity of utility classes, Tailwind's approach actually tends to result in less CSS overall compared to traditional methodologies. Plus, with modern tooling like PurgeCSS (built into Tailwind CSS v2.0 and later), your production CSS can be extremely lightweight, including only the utilities you actually use.",
      "To get started with Tailwind CSS, you can install it as a dependency in your project and configure it to work with your build system. The Tailwind documentation provides excellent guides for setting it up with various frameworks and build tools.",
    ]
  },
  {
    id: 3,
    title: "Effective State Management in React Applications",
    slug: "effective-state-management-react",
    date: "June 10, 2023",
    excerpt: "Compare different approaches to state management in React and learn when to use local state, context, or external libraries.",
    content: [
      "State management is a crucial aspect of React application development. As your applications grow in complexity, managing state effectively becomes increasingly important for maintainability and performance.",
      "React provides several built-in options for state management, and there are also popular third-party libraries. Let's explore when to use each approach.",
      "Local Component State with useState is the simplest form of state management in React. It's perfect for component-specific state that doesn't need to be shared widely throughout your application. For example, form input values, toggle states, or loading indicators.",
      "```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>Increment</button>\n    </div>\n  );\n}\n```",
      "The Context API is React's built-in solution for sharing state across many components without prop drilling. It's ideal for theme data, user authentication, or preferences that many components throughout your application need access to.",
      "```jsx\n// Create a context\nconst ThemeContext = React.createContext('light');\n\n// Provider component\nfunction App() {\n  const [theme, setTheme] = useState('light');\n  \n  return (\n    <ThemeContext.Provider value={{ theme, setTheme }}>\n      <Main />\n    </ThemeContext.Provider>\n  );\n}\n\n// Consumer component\nfunction ThemedButton() {\n  const { theme } = useContext(ThemeContext);\n  return <button className={theme}>Themed Button</button>;\n}\n```",
      "For more complex state management needs, libraries like Redux, MobX, or Zustand provide robust solutions. These are particularly useful for large applications with complex state interactions, or when you need features like time-travel debugging, state persistence, or middleware for side effects.",
      "In modern React development, many applications use a combination of these approaches. Local state for simple component-specific needs, Context API for widely shared but simple state, and a state management library for complex global state.",
      "When choosing a state management approach, consider the complexity of your state, how widely it needs to be shared, and what additional features you might need. Remember that simpler is often better—don't reach for a complex solution unless your application's needs demand it.",
    ]
  }
];
