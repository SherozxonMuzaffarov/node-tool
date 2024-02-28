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
                    component: () => import("../views/Product/Product.vue"),
                },
                {
                    path: "/product/create",
                    name: "ProductCreate",
                    component: () => import("../views/Product/Create.vue"),
                },
                {
                    path: "/metrology-sklad",
                    name: "/metrology-sklad",
                    component: () => import("../views/MetrologySklad.vue"),
                },
                {
                    path: "/user",
                    name: "/user",
                    component: () => import("../views/User.vue"),
                },
                {
                    path: "/region",
                    name: "/region",
                    component: () => import("../views/Region.vue"),
                },
                {
                    path: "/depo",
                    name: "/depo",
                    component: () => import("../views/Depo.vue"),
                }
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
