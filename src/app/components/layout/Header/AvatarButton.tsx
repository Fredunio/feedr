import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function AvatarButton({ user }: { user: Session["user"] | undefined }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative group inline-block ">
      <div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className=" rounded-full shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          id="menu-button"
          aria-expanded={open}
          aria-haspopup="true"
        >
          {user && user.image ? (
            <Image
              src={user.image}
              alt={"avatar"}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <Image
              src={"/default-avatar.jpg"}
              alt={"avatar"}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
        </button>
      </div>

      <div
        className={`group-hover:block hidden absolute right-0 z-10 py-1  origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div
          className="py-1 text-sm px-2 flex items-center flex-col gap-1"
          role="none"
        >
          <Link
            href="#"
            className="text-slate-700 hover:bg-slate-200 rounded-md active:bg-slate-300 block px-10 py-1 "
            role="menuitem"
            tabIndex={-1}
          >
            Account
          </Link>

          <Link
            href="#"
            className="text-slate-700 hover:bg-slate-200 rounded-md active:bg-slate-300 block px-10 py-1 "
            role="menuitem"
            tabIndex={-1}
          >
            Orders
          </Link>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              signOut();
            }}
            className="mt-2"
          >
            <button
              type="submit"
              className="text-white block w-full px-10 rounded-md hover:bg-primaryLight bg-primary py-1 "
              role="menuitem"
              tabIndex={-1}
              id="menu-item-3"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AvatarButton;
