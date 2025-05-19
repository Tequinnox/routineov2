import Image from "next/image";
import { UserInfo } from './components/UserInfo'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Welcome to Routineo</h1>
        <UserInfo />
      </div>
    </main>
  );
}
