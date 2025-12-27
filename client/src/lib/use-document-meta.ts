import { useEffect } from "react";

interface DocumentMeta {
  title?: string;
  description?: string;
}

const DEFAULT_TITLE = "Sober Stay | Find Sober Living Homes Near You";
const DEFAULT_DESCRIPTION = "Sober Stay helps people find safe, supportive sober living homes. Browse recovery housing, learn the rules, and connect with providers.";

export function useDocumentMeta({ title, description }: DocumentMeta) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      }

      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute("content", description);
      }

      let twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute("content", description);
      }
    }

    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", title);
      }

      let twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute("content", title);
      }
    }

    return () => {
      document.title = DEFAULT_TITLE;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute("content", DEFAULT_DESCRIPTION);
      }

      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", DEFAULT_TITLE);
      }

      let ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute("content", DEFAULT_DESCRIPTION);
      }

      let twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute("content", DEFAULT_TITLE);
      }

      let twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute("content", DEFAULT_DESCRIPTION);
      }
    };
  }, [title, description]);
}
