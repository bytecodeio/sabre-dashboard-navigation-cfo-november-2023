export const sortDashboards = (dashboards, sortOrder) => {
  const sortedDashboards = [...dashboards];
  sortedDashboards.sort((a, b) => {
    if (sortOrder.includes(a.id) && sortOrder.includes(b.id)) {
      return sortOrder.indexOf(a.id) - sortOrder.indexOf(b.id);
    } else if (sortOrder.includes(a.id)) {
      return -1;
    } else if (sortOrder.includes(b.id)) {
      return 1;
    } else {
      return 0;
    }
  });
  return sortedDashboards;
};
