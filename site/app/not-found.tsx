import Link from "next/link";
import { ArrowIcon } from "@/components/icons";

export default function NotFound() {
  return <div className="not-found page-shell"><span>404</span><p className="eyebrow">SIGNAL LOST</p><h1>ไม่พบคลื่นเสียงนี้</h1><p>The requested archive frequency could not be found.</p><Link className="button button-primary" href="/">RETURN TO CONTROL ROOM <ArrowIcon /></Link></div>;
}
