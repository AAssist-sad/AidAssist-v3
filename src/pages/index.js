export default function Home() {
  return (
    <div>
      <h1>Bundler utilisé :</h1>
      <p>{process.env.__NEXT_BUNDLER || "Non défini"}</p>
    </div>
  );
}
