import { FC } from "react";
import "./App.css";
import allTrees from "./tree-data.json";

type Tree = Omit<typeof allTrees[number], "(unranked)" | "Division" | "Class">;
type TaxonomicRank = keyof Tree;

// domain, kingdom, phylum, class, order, family, genus, and species

const taxonomies: Array<TaxonomicRank> = [
  "Kingdom",
  "Order",
  "Family",
  "Genus",
  "Name",
];

const Taxonomy: FC<{ trees: Array<Tree>; rank: TaxonomicRank }> = (props) => {
  const { trees, rank } = props;

  const taxons = trees.reduce<Array<Tree>>((a, c) => {
    if (a.find((v) => v[rank].value === c[rank].value)) {
      return a;
    }
    return [...a, c];
  }, []);

  return (
    <div title={rank}>
      {taxons.map((taxon) => {
        const treesInTaxon = trees.filter(
          (t) => t[rank].value === taxon[rank].value
        );
        const subRank = taxonomies[taxonomies.indexOf(rank) + 1];

        if (!subRank) {
          return (
            <div style={{ paddingLeft: 20 }}>
              <a href={taxon[rank].href}>{taxon[rank].value}</a>
            </div>
          );
        }
        return (
          <details open>
            <summary>
              <a href={taxon[rank].href} target="_blank">{taxon[rank].value}</a>
            </summary>
            <Taxonomy trees={treesInTaxon} rank={subRank} />
          </details>
        );
      })}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Taxonomy rank={taxonomies[0]} trees={allTrees} />
    </div>
  );
}

export default App;
