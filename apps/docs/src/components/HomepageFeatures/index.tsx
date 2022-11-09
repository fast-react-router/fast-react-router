import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Easy to Use",
    description: (
      <>fast-react-router is designed to be easy and simple to use.</>
    ),
  },
  {
    title: "Focus on What Matters",
    description: (
      <>
        fast-react-router lets you focus on your page without having to worry
        about your routes.
      </>
    ),
  },
  {
    title: "Fast",
    description: (
      <>
        fast-react-router is build on the new <code>useSyncExternalStore</code>{" "}
        hook from React-v18 to be as fast as possible.
      </>
    ),
  },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
