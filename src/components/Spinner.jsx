/**
 * Centered loading spinner used during async data fetches.
 */
const Spinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
  </div>
);

export default Spinner;
