<script setup>
import { defineAsyncComponent } from "vue";
import { useHead, useSeoMeta } from "#imports";
import { site, person, socials, experiences } from "#shared/profile";
import AccessibleContent from "@/components/AccessibleContent.vue";
import LoadingScreen from "@/components/common/LoadingScreen.vue";
import SoundToggle from "@/components/SoundToggle.vue";

// The page is prerendered, but the menu/cards and the WebGPU scene only make sense in a
// browser (GSAP SplitText, three/webgpu). Loading them async inside <ClientOnly> keeps
// their modules off the server entirely and out of the first JS chunk. The menu renders
// nothing until the scene has loaded anyway.
const Menu = defineAsyncComponent(() => import("@/components/theMenu.vue"));
const TheExperience = defineAsyncComponent(() =>
  import("@/components/webgl/theExperience.vue")
);

const pageUrl = `${site.url}/`;
const imageUrl = `${site.url}${site.image.path}`;
const sameAs = Object.values(socials).map((social) => social.url);

useSeoMeta({
  title: site.title,
  description: site.description,
  robots: "index, follow, max-image-preview:large",
  ogType: "profile",
  ogTitle: site.title,
  ogDescription: site.description,
  ogUrl: pageUrl,
  ogSiteName: site.name,
  ogLocale: site.locale,
  ogImage: imageUrl,
  ogImageType: "image/png",
  ogImageWidth: site.image.width,
  ogImageHeight: site.image.height,
  ogImageAlt: site.image.alt,
  profileFirstName: person.givenName,
  profileLastName: person.familyName,
  twitterCard: "summary",
  twitterSite: site.twitter,
  twitterCreator: site.twitter,
  twitterTitle: site.title,
  twitterDescription: site.description,
  twitterImage: imageUrl,
  twitterImageAlt: site.image.alt,
  themeColor: "#111111",
  colorScheme: "dark",
});

useHead({
  link: [
    { rel: "canonical", href: pageUrl },
    // Same page as clean Markdown, for LLMs and answer engines (see server/routes/).
    { rel: "alternate", type: "text/markdown", href: "/index.md", title: "Markdown version" },
    ...sameAs.map((href) => ({ rel: "me", href })),
  ],
  script: [
    {
      type: "application/ld+json",
      // unhead serialises (and escapes) an object here.
      innerHTML: {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": `${pageUrl}#website`,
            url: pageUrl,
            name: site.name,
            description: site.description,
            inLanguage: site.language,
            publisher: { "@id": `${pageUrl}#person` },
          },
          {
            "@type": "ProfilePage",
            "@id": `${pageUrl}#profilepage`,
            url: pageUrl,
            name: site.title,
            description: site.description,
            inLanguage: site.language,
            isPartOf: { "@id": `${pageUrl}#website` },
            mainEntity: { "@id": `${pageUrl}#person` },
          },
          {
            "@type": "Person",
            "@id": `${pageUrl}#person`,
            name: person.name,
            givenName: person.givenName,
            familyName: person.familyName,
            alternateName: person.alternateName,
            url: pageUrl,
            image: imageUrl,
            jobTitle: person.jobTitle,
            description: person.bio[0],
            // The experience list is most-recent-first.
            worksFor: { "@type": "Organization", name: experiences[0].title },
            knowsAbout: person.knowsAbout,
            sameAs,
          },
        ],
      },
    },
  ],
});
</script>

<template>
  <AccessibleContent />
  <LoadingScreen />
  <ClientOnly>
    <Menu />
    <Suspense>
      <TheExperience />
    </Suspense>
    <SoundToggle />
  </ClientOnly>
</template>
