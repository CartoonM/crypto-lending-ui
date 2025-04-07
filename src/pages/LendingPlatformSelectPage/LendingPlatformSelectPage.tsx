import { Link } from "react-router";

import { supportedPlatforms } from "@/resources";

export const LendingPlatformSelectPage = () => {
  return (
    <div className="mx-auto mt-8 max-w-4xl px-4">
      <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-semibold text-white">Platforms</h2>

        <div className="flex flex-wrap gap-4">
          {supportedPlatforms.map((platform) => (
            <Link
              key={platform.name}
              to={`/lending/${platform.id}`}
              className="flex-1 min-w-[200px] rounded-lg border border-gray-700 bg-gray-800 px-6 py-4 text-center font-medium text-white transition-colors hover:bg-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {platform.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
