import React, { useMemo, useState } from "react";
import { useAppSelector } from "../state/hooks";
import { chunk, debounce } from "lodash";
import { Host } from "../../global";
import Pill from "./pill";
import Textbox from "./textbox";

const renderRow = (host: Host) => {
  return (
    <tr key={host.id}>
      <td className=" w-1/3 px-4 py-4 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{host.id}</p>
      </td>
      <td className="w-1/3 px-4 py-4 border-b border-gray-200 bg-white text-sm">
        <Pill colour="green" text={host.domain} />
      </td>
      <td className="w-1/3 px-4 py-4 border-b border-gray-200 bg-white text-sm">
        <p className="text-gray-900 whitespace-no-wrap">{host.ip}</p>
      </td>
    </tr>
  );
};

const renderPagination = (
  selectedPage: number,
  totalPages: number,
  onPageChanged: any
) => {
  const pageNumbers = [];
  const lowerBoundary = 1;
  const upperBoundary = totalPages;
  const lowerBoundaryMax = lowerBoundary + 4;
  const upperBoundaryMax = upperBoundary - 4;
  const atLowerBoundary = selectedPage === lowerBoundary;
  const atUpperBoundary = selectedPage === upperBoundary;

  const middleBounds = [selectedPage - 1, selectedPage, selectedPage + 1];

  const renderPageNumber = (number?: number) => (
    <div
      className={`w-8 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full ${
        selectedPage === number ? "bg-green-500 text-white" : ""
      }`}
      onClick={() => (number ? onPageChanged(number) : null)}
    >
      {number || "..."}
    </div>
  );

  const renderArrow = (up: boolean) => {
    return (
      <div
        onClick={() => {
          if (atLowerBoundary && !up) {
            return;
          } else if (atUpperBoundary && up) {
            return;
          }
          onPageChanged(up ? selectedPage + 1 : selectedPage - 1);
        }}
        className={`${
          up ? "ml-1" : "mr-1"
        } h-8 w-8  flex justify-center items-center rounded-full bg-gray-100 cursor-pointer`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`feather ${
            up ? "feather-chevron-right" : "feather-chevron-left"
          } w-4 h-4`}
        >
          {up ? (
            <polyline points="9 18 15 12 9 6"></polyline>
          ) : (
            <polyline points="15 18 9 12 15 6"></polyline>
          )}
        </svg>
      </div>
    );
  };

  for (let i = 1; i <= totalPages; i++) {
    if (i === lowerBoundary) {
      pageNumbers.push(renderPageNumber(i));
    } else if (i === upperBoundary) {
      pageNumbers.push(renderPageNumber(i));
    } else if (selectedPage < lowerBoundaryMax && i < lowerBoundaryMax) {
      pageNumbers.push(renderPageNumber(i));
    } else if (selectedPage > upperBoundaryMax && i > upperBoundaryMax) {
      pageNumbers.push(renderPageNumber(i));
    } else if (middleBounds.includes(i)) {
      pageNumbers.push(renderPageNumber(i));
    } else if (
      (selectedPage < lowerBoundaryMax && i === lowerBoundaryMax) ||
      (selectedPage > upperBoundaryMax && i === upperBoundaryMax) ||
      (i === middleBounds[0] - 1 && middleBounds[0] - 1 >= lowerBoundary + 1) ||
      (i === middleBounds[2] + 1 && middleBounds[2] + 1 <= upperBoundary - 1)
    ) {
      pageNumbers.push(renderPageNumber());
    }
  }
  return (
    <div className="flex flex-col items-center my-4">
      <div className="flex">
        {renderArrow(false)}
        <div className="flex h-8 font-medium rounded-full bg-gray-100">
          {pageNumbers}
        </div>
        {renderArrow(true)}
      </div>
    </div>
  );
};

interface EnrichedHosts {
  [key: string]: Array<Host>;
}

const header = (() => {
  return (
    <tr key={"0"}>
      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
        ID
      </th>
      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
        Host Name
      </th>
      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
        IP
      </th>
    </tr>
  );
})();

export default function HostsTable() {
  const { hosts } = useAppSelector((state) => state.host);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pageNumber, setPageNumber] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const enrichedHosts = useMemo(() => {
    const enrichedHosts: EnrichedHosts = {};

    let cumulativeHosts = [...hosts.system, ...hosts.user].sort((a, b) => {
      if (a.id === b.id) {
        return 0;
      } else {
        return a.id < b.id ? -1 : 1;
      }
    });

    if (searchValue) {
      const searchedHosts = [];
      for (var i = 0; i < cumulativeHosts.length; i++) {
        for (const [_, value] of Object.entries(cumulativeHosts[i])) {
          if (typeof value === "string" && value.indexOf(searchValue) != -1) {
            searchedHosts.push(cumulativeHosts[i]);
          }
        }
      }
      cumulativeHosts = searchedHosts;
    }

    chunk(cumulativeHosts, rowsPerPage).map((hostsChunk, i) => {
      enrichedHosts["" + (i + 1)] = hostsChunk;
    });
    return enrichedHosts;
  }, [hosts, rowsPerPage, searchValue]);

  const rows = useMemo(() => {
    const hostsToRender = enrichedHosts[`${pageNumber}`];
    const rows = [];
    if (hostsToRender) {
      for (const host of hostsToRender) {
        rows.push(renderRow(host));
      }
    }
    return rows;
  }, [enrichedHosts, rowsPerPage, pageNumber]);

  const searchForText = debounce((text) => {
    setSearchValue(text);
    setPageNumber(1);
  }, 750);

  const search = useMemo(() => {
    return (
      <>
        <div className="block relative">
          <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current text-gray-500"
            >
              <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"></path>
            </svg>
          </span>

          <Textbox
            placeholder="Search"
            onChange={(evt) => {
              searchForText(evt.target.value);
            }}
            className="appearance-none rounded-r rounded-l border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
          />
        </div>
        <div className="flex flex-row  mb-1 sm:mb-0">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-100">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </>
    );
  }, []);

  return (
    <>
      <div className="my-2 justify-end flex sm:flex-row flex-col">{search}</div>
      <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div className="inline-block min-w-full rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal text-center">
            <thead className="text-center">{header}</thead>
            <tbody>{rows}</tbody>
          </table>
          {renderPagination(
            pageNumber,
            Object.keys(enrichedHosts).length,
            setPageNumber
          )}
        </div>
      </div>
    </>
  );
}
