const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "board", component: () => import("pages/CommunityBoard.vue") },
      { path: "inbox", component: () => import("pages/ChatMessages.vue") },
      { path: "profile", component: () => import("pages/ProfilePage.vue") },
      {
        path: "entries/:id",
        name: "single-entry",
        component: () => import("src/pages/CommunityBoardEntryView.vue"),
      },
      {
        path: "add",
        name: "add-entry",
        component: () => import("src/pages/AddEntry.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("src/pages/AuthRegisterPage.vue"),
      },
      {
        path: "login",
        name: "login",
        component: () => import("src/pages/AuthLoginPage.vue"),
      },
      {
        path: "community",
        name: "community",
        component: () => import("src/pages/AuthRegisterCommunityPage.vue"),
      },
      {
        path: "/dummy",
        name: "dummy",
        component: () => import("../pages/dummyEntries.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
