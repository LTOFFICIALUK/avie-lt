"use client";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import { useRouter, usePathname, useParams } from "next/navigation";
import React, { useMemo } from "react";
import Link from "next/link";

const BreadcrumbsNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = params?.lang as string;

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean).slice(1);

    const paths = segments.map(
      (_, i) => `/${locale}/` + segments.slice(0, i + 1).join("/")
    );
    const labels = segments.map((label) =>
      label
        .replace(/-/g, " ")
        .replace(/_/g, " & ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    );

    const res = labels.map((label, index) => ({
      text: label,
      path: paths[index],
    }));

    return res;
  }, [pathname, locale]);

  const pageTitle =
    breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].text : "Feed";

  return (
    pageTitle !== "Feed" && (
      <Space size="large">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
        />
        <div>
          <Space
            split="/"
            style={{ color: "var(--text-secondary)", marginBottom: 4 }}
          >
            {breadcrumbs.map((crumb, index) => (
              <Link
                key={index}
                href={crumb.path}
                style={{
                  color: "inherit",
                  textDecoration:
                    breadcrumbs.length > 1
                      ? index === breadcrumbs.length - 1
                        ? "none"
                        : "underline"
                      : "underline",
                }}
              >
                {crumb.text}
              </Link>
            ))}
          </Space>
          <h1>{pageTitle}</h1>
        </div>
      </Space>
    )
  );
};

export default BreadcrumbsNav;
