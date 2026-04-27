export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
          Welcome to DevFlow
        </h1>
        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          The developer Q&A platform for the modern web.
        </p>
      </div>

      <div className="mt-16 w-full max-w-3xl">
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              [Placeholder for Feed]
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400 mx-auto">
              <p>Posts will be dynamically loaded here in the next phase.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
