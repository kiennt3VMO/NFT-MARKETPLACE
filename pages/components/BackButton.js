import Link from 'next/link';

function BackButton() {
  return (
    <div>
      <Link href="/">
        <button className="inline-flex items-center px-4 py-2 bg-[#44b8e6] hover:bg-[#258dd3]
        shadow-lg shadow-yellow-100 text-white rounded">
          <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 3.293a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 0 1.414l5 5a1 1 0 0 0 1.414-1.414L6.414 11H17a1 1 0 1 0 0-2H6.414l2.293-2.293a1 1 0 0 0 0-1.414z" clipRule="evenodd" />
          </svg>
          Back Home
        </button>
      </Link>
    </div>
  );
}

export default BackButton;
