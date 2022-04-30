import { FC, useEffect, useState } from "react";
import "./App.css";
import allTrees from "./tree-data.json";

type Tree = Omit<typeof allTrees[number], "(unranked)" | "Division" | "Class">;
type TaxonomicRank = keyof Tree;

// domain, kingdom, phylum, class, order, family, genus, species

const taxaByName: Array<TaxonomicRank> = [
  "Kingdom",
  "Order",
  "Family",
  "Genus",
  "Name",
];

const taxaBySpecies: Array<TaxonomicRank> = [
  "Kingdom",
  "Order",
  "Family",
  "Genus",
  "Species",
];

const Taxonomy: FC<{
  trees: Array<Tree>;
  taxonomies: Array<TaxonomicRank>;
  rank: TaxonomicRank;
}> = (props) => {
  const { trees, taxonomies, rank } = props;

  const parentTaxa = (tree: Tree) => {
    return taxonomies.slice(0, taxonomies.indexOf(rank)).map((t) => tree[t]);
  }

  const taxaInRank = trees.reduce<Array<Tree>>((a, c) => {
    if (a.find((v) => v[rank].value === c[rank].value)) {
      return a;
    }
    return [...a, c];
  }, []);

  return (
    <div>
      {taxaInRank.map((taxon) => {
        const treesInTaxon = trees.filter(
          (t) => t[rank].value === taxon[rank].value
        );
        const subRank = taxonomies[taxonomies.indexOf(rank) + 1];
        const hasSubrank = subRank !== undefined;
        const title = parentTaxa(taxon)
          .map((t) => t.value)
          .concat(taxon[rank].value)
          .join(" / ");

        return (
          <details open={hasSubrank} title={title}>
            <summary>
              <a href={taxon[rank].href} target="_blank" rel="noreferrer">
                {taxon[rank].value}
              </a>
            </summary>
            {hasSubrank && (
              <Taxonomy
                taxonomies={taxonomies}
                trees={treesInTaxon}
                rank={subRank}
              />
            )}
          </details>
        );
      })}
    </div>
  );
};

function App() {
  const [taxonomies, setTaxonomies] = useState<Array<TaxonomicRank>>(taxaByName);
  const [startRank, setStartRank] = useState<TaxonomicRank>(taxonomies[0]);

  useEffect(() => {
    function onKeyup(e: KeyboardEvent) {
      switch (e.key) {
        case "s": {
          setTaxonomies((p) => {
            if (p === taxaByName) {
              return taxaBySpecies;
            }
            return taxaByName;
          });
          break;
        }
        case "Escape": {
          setStartRank(taxonomies[0]);
          break;
        }
      }
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, [taxonomies]);

  const onSetStartRank = (rank: TaxonomicRank) => {
    setStartRank(rank);
  };

  const nonActiveTaxonomy = taxonomies[taxonomies.indexOf(startRank) - 1];
  const curtailedTaxonomies = taxonomies.slice(taxonomies.indexOf(startRank));

  return (
    <div className="App">
      <header>
        {nonActiveTaxonomy && (
          <button onClick={() => onSetStartRank(nonActiveTaxonomy)}>
            ...{nonActiveTaxonomy}
          </button>
        )}
        <ol>
          {curtailedTaxonomies.map((taxonomy) => (
            <li>
              <button onClick={() => onSetStartRank(taxonomy)}>
                {taxonomy}
              </button>
            </li>
          ))}
        </ol>
        <fieldset>
          <label>
            Name
            <input
              type="radio"
              checked={taxonomies === taxaByName}
              onClick={() => setTaxonomies(taxaByName)}
            />
          </label>
          <label>
            Species
            <input
              type="radio"
              checked={taxonomies === taxaBySpecies}
              onClick={() => setTaxonomies(taxaBySpecies)}
            />
          </label>
        </fieldset>
      </header>
      <main>
        <Taxonomy
          taxonomies={taxonomies}
          rank={curtailedTaxonomies[0]}
          trees={allTrees}
        />
      </main>
    </div>
  );
}

export default App;
