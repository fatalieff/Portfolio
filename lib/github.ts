export type RepoInfo = {
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
  htmlUrl: string;
};

const REPOS: Array<{ owner: string; repo: string }> = [
  { owner: "fatalieff", repo: "HellVar" },
  { owner: "fatalieff", repo: "foodie-react" },
  { owner: "fatalieff", repo: "gala-garden-cinema" },
];

export const FALLBACK_REPOS: RepoInfo[] = [
  {
    name: "HellVar",
    fullName: "fatalieff/HellVar",
    description: null,
    language: "TypeScript",
    stars: 0,
    forks: 0,
    updatedAt: "",
    htmlUrl: "https://github.com/fatalieff/HellVar",
  },
  {
    name: "foodie-react",
    fullName: "fatalieff/foodie-react",
    description: null,
    language: "JavaScript",
    stars: 0,
    forks: 0,
    updatedAt: "",
    htmlUrl: "https://github.com/fatalieff/foodie-react",
  },
  {
    name: "gala-garden-cinema",
    fullName: "fatalieff/gala-garden-cinema",
    description: null,
    language: "JavaScript",
    stars: 0,
    forks: 0,
    updatedAt: "",
    htmlUrl: "https://github.com/fatalieff/gala-garden-cinema",
  },
];

export async function fetchRepos(): Promise<RepoInfo[]> {
  const token = process.env.GITHUB_TOKEN;

  const results = await Promise.all(
    REPOS.map(async ({ owner, repo }) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: token
            ? { Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28" }
            : {},
          next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return {
          name: data.name,
          fullName: data.full_name,
          description: data.description,
          language: data.language,
          stars: data.stargazers_count,
          forks: data.forks_count,
          updatedAt: data.updated_at,
          htmlUrl: data.html_url,
        } satisfies RepoInfo;
      } catch {
        return null;
      }
    })
  );

  return results.filter((repo): repo is RepoInfo => repo !== null);
}
