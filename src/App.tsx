import { FC, useState } from "react";
import "./App.css";
import allTrees from "./tree-data.json";

type Tree = Omit<typeof allTrees[number], "(unranked)" | "Division" | "Class">;
type TaxonomicRank = keyof Tree;

// domain, kingdom, phylum, class, order, family, genus, species
const taxonomies: Array<TaxonomicRank> = [
  "Kingdom",
  "Order",
  "Family",
  "Genus",
  "Name",
];

const Taxonomy: FC<{ trees: Array<Tree>; rank: TaxonomicRank }> = (props) => {
  const { trees, rank } = props;

  const taxonomiesInRank = trees.reduce<Array<Tree>>((a, c) => {
    if (a.find((v) => v[rank].value === c[rank].value)) {
      return a;
    }
    return [...a, c];
  }, []);

  return (
    <div title={rank}>
      {taxonomiesInRank.map((taxon) => {
        const treesInTaxon = trees.filter(
          (t) => t[rank].value === taxon[rank].value
        );
        const subRank = taxonomies[taxonomies.indexOf(rank) + 1];

        if (!subRank) {
          return (
            <div>
              <em>
                <a href={taxon[rank].href} title={taxon.Species.value}>{taxon[rank].value}</a>
              </em>
            </div>
          );
        }
        return (
          <details open>
            <summary>
              <a href={taxon[rank].href} target="_blank">
                {taxon[rank].value}
              </a>
            </summary>
            <Taxonomy trees={treesInTaxon} rank={subRank} />
          </details>
        );
      })}
    </div>
  );
};

function App() {

  const [startRank, setStartRank] = useState<TaxonomicRank>(taxonomies[0]);

  const onSetStartRank = (rank: TaxonomicRank) => {
    setStartRank(rank)
  }

  const parentTaxonomy = taxonomies[taxonomies.indexOf(startRank) - 1];
  const curtailedTaxonomies = taxonomies.slice(taxonomies.indexOf(startRank))

  return (
    <div className="App">
      <header>
        {parentTaxonomy && <button onClick={() => onSetStartRank(parentTaxonomy)}>
          ...{parentTaxonomy}
        </button>}
        <ol>
          {curtailedTaxonomies.map(taxonomy => 
          <li>
            <button onClick={() => onSetStartRank(taxonomy)}>
              {taxonomy}
            </button>
          </li>)}
        </ol>
      </header>
      <main>
      <Taxonomy rank={curtailedTaxonomies[0]} trees={allTrees} />
      </main>
    </div>
  );
}

export default App;
