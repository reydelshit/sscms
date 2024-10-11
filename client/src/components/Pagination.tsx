import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type PaginationTemplateProps = {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
};

const PaginationTemplate = ({
  totalPages,
  currentPage,
  handlePageChange,
}: PaginationTemplateProps) => {
  return (
    <div className="my-[2rem]">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer text-[#FDF3C0]"
              onClick={() =>
                currentPage === 1
                  ? handlePageChange(totalPages)
                  : handlePageChange(currentPage - 1)
              }
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  className={`mx-1 ${
                    currentPage === pageNumber
                      ? 'bg-orange-500'
                      : 'bg-[#FFD863]'
                  }`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className="text-[#FDF3C0]"
              href="#"
              onClick={() =>
                currentPage === totalPages
                  ? handlePageChange(1)
                  : handlePageChange(currentPage + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationTemplate;
