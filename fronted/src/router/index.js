import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "/",
            component: () => import("../layouts/main.vue"),
            children: [
                {
                    path: "/product",
                    name: "/product",
                    component: () => import("../views//Product.vue"),
                },
                {
                    path: "/user",
                    name: "/user",
                    component: () => import("../views/User.vue"),
                },
            ],
        },
        {
            path: "/login",
            name: "/login",
            component: () => import("../views/Login.vue"),
        },
    ],
});

export default router;
