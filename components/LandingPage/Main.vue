<template>
    <LandingPageHeader />
    <div
        class="flex min-h-[150vh] max-w-[100vw] flex-col items-center justify-start xl:flex-row xl:items-start xl:justify-between">
        <div class="shrink xl:w-1/2">
            <div
                class="flex min-h-[calc(100vh-4rem)] items-center justify-center px-2 py-10 text-center xl:justify-start xl:pe-0 xl:ps-10 xl:text-start">
                <div>
                    <div class="flex flex-col items-center gap-6 xl:flex-row">
                        <div data-tip="copy" class="tooltip tooltip-accent"><button
                                class="btn btn-sm cursor-copy rounded-full font-mono font-light">
                            </button></div>
                        <div class="flex gap-2 font-mono text-lg">Made in Kazakhstan 🇰🇿</div>
                    </div>
                    <div class="h-4"></div>
                    <h1
                        class="font-title text-center text-[clamp(2rem,6vw,4.2rem)] font-black leading-[1.1] [word-break:auto-phrase] xl:w-[115%] xl:text-start [:root[dir=rtl]_&amp;]:leading-[1.35]">
                        <span
                            class="[&amp;::selection]:text-base-content brightness-150 contrast-150 [&amp;::selection]:bg-blue-700/20">Лучшая
                            онлайн-система </span> <br> <span class="inline-grid "><span
                                class=" pointer-events-none col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-border opacity-45 blur-xl [transform:translate3d(0,0,0)] [-webkit-text-fill-color:transparent] before:content-[attr(data-text)] [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)]"
                                aria-hidden="true" data-text="component library"></span> <span
                                class=" [&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,theme(colors.error)_0%,theme(colors.secondary)_9%,theme(colors.secondary)_42%,theme(colors.primary)_47%,theme(colors.accent)_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,oklch(var(--s))_4%,color-mix(in_oklch,oklch(var(--s)),oklch(var(--er)))_22%,oklch(var(--p))_45%,color-mix(in_oklch,oklch(var(--p)),oklch(var(--a)))_67%,oklch(var(--a))_100.2%)] ">
                                онлайн бронирования </span></span> <br> <span
                            class="[&amp;::selection]:text-base-content brightness-150 contrast-150 [&amp;::selection]:bg-blue-700/20">
                            для бизнеса</span>
                    </h1>
                    <div class="h-4"></div>
                    <p class="text-base-content/70 font-title py-4 font-light md:text-lg xl:text-xl">Все, что вам нужно
                        для управления вашего бизнеса. Запланируйте клиентов. Забронируйте клиентов. Настройте
                        онлайн-бронирование. Управляйте
                        сотрудниками. Автоматизируйте все с помощью самого бюджетного решения
                        на рынке.</p>
                    <div class="h-10"></div>
                    <div>
                        <div
                            class="inline-flex w-full flex-col items-stretch justify-center gap-2 px-4 md:flex-row xl:justify-start xl:px-0">
                            <a data-sveltekit-preload-data="" href="/components/"
                                class="btn md:btn-lg md:btn-wide group px-12"><span class="hidden sm:inline">Начать
                                    пробный период</span> <span class="inline sm:hidden">Начать пробный
                                    период</span></a> <a data-sveltekit-preload-data="" href="/docs/install/"
                                class="btn btn-neutral md:btn-lg md:btn-wide group px-12">Как использовать? <svg
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor"
                                    class="hidden h-6 w-6 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 md:inline-block">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"></path>
                                </svg></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>