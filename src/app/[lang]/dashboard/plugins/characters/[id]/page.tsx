import { CharacterForm } from "../(components)/CharacterForm";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditCharacterPage({ params }: PageProps) {
  const resolvedParams = await params;

  return <CharacterForm characterId={resolvedParams.id} />;
}
