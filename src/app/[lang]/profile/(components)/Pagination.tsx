import { Pagination as AntPagination } from "antd";
import React from "react";

interface Props {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onChange: (page: number) => void;
}

const Pagination = ({ currentPage, pageSize, totalItems, onChange }: Props) => {
  return (
    <div className="flex justify-center mt-6">
      <AntPagination
        current={currentPage}
        pageSize={pageSize}
        total={totalItems}
        onChange={onChange}
        showSizeChanger={false}
        className="[&_.ant-pagination-item]:bg-[var(--color-gray)] [&_.ant-pagination-item]:border-none [&_.ant-pagination-item-active]:bg-[var(--color-brand)] [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item]:text-white [&_.ant-pagination-prev]:bg-[var(--color-gray)] [&_.ant-pagination-prev]:border-none [&_.ant-pagination-next]:bg-[var(--color-gray)] [&_.ant-pagination-next]:border-none [&_.ant-pagination-prev_button]:text-white [&_.ant-pagination-next_button]:text-white"
      />
    </div>
  );
};

export default Pagination;
