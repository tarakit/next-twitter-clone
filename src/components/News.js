export default function News({ article }) {
    return (
        // noreferrer is used to prevent the page from being able to access the page that is being linked to
      <a rel="noreferrer" href={article.url} target="_blank">
        <div className="flex items-center justify-between px-4 py-2 space-x-1 hover:bg-gray-200 transition duration-500 ease-out">
          <div className="space-y-0.5">
            <h6 className="text-sm font-bold">{article.title}</h6>
            <p className="text-xs font-medium text-gray-500">
              {article.source.name}
            </p>
          </div>
          <img
            className="rounded-xl "
            width="70"
            src={article.urlToImage}
            alt=""
          />
        </div>
      </a>
    );
  }