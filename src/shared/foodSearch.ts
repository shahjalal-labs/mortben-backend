export const foodSearch = (search: string | null) => {
  if (!search) {
    return undefined;
  }

  const searchConditions = [];
  if (search) {
    searchConditions.push(
      { foodName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } }
    );
  }

  return {
    OR: searchConditions,
  };
};
