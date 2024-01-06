import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/account", label: "Account" },
  { href: "/orders", label: "Orders" },
];

const adminLinks = [
  { href: "/account/admin/categories", label: "Categories" },
  { href: "/account/admin/menuItems", label: "Menu Items" },
  { href: "/account/admin/users", label: "Users" },
];

export default function AccountLinks({
  isAdmin,
}: {
  isAdmin: boolean | undefined;
}) {
  const path = usePathname();

  return (
    <div className="flex w-full mx-auto gap-2 justify-start items-center flex-wrap mb-20 border-b-1 pb-6 border-slate-200">
      {links.map(({ href, label }) => (
        <Link
          className={`${path === href ? "account-active-tab" : ""} account-tab`}
          href={href}
          key={href}
        >
          {label}
        </Link>
      ))}
      {isAdmin && (
        <>
          <div className="h-4 w-[0.1rem] rounded-md bg-slate-400" />

          {adminLinks.map(({ href, label }) => (
            <Link
              className={`${
                path.startsWith(href) ? "account-active-tab" : ""
              } account-tab`}
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
