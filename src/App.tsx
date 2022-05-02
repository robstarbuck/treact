import "./App.css";
import { FC } from "react";
import allTrees from "./data.json";

// Types
type Tree = typeof allTrees[number];
type TaxonomicRank = keyof Tree;
type TaxonomyProps = { children: Array<Tree>; rank: TaxonomicRank }

// This is only a subset of - domain, kingdom, phylum, class, order, family, genus, species
const taxonomicRanks: Array<TaxonomicRank> = [
  "Kingdom",
  "Order",
  "Family",
  "Genus",
  "Species"
];

// Our recursive taxonomy which calls itself where child taxonomies exist
const Taxonomy: FC<TaxonomyProps> = (props) => {
  const { children, rank } = props;

  // Find the unique taxa in our child taxonomies
  // EG unique taxa with a key of "Genus"
  const taxaInRank = children.reduce<Array<Tree>>((a, c) => {
    if (a.find((v) => v[rank] === c[rank])) {
      return a;
    }
    return [...a, c];
  }, []);

  return (
    <div>
      {/* Loop through the taxa in the rank */}
      {taxaInRank.map((taxon) => {
        const childrenOfTaxon = children.filter(
          (t) => t[rank] === taxon[rank]
        );
        // By using the .at method typescript includes undefined in the type
        // should our index not be in the array
        // https://www.typescriptlang.org/play?target=9&ts=4.6.2#code/MYewdgzgLgBFDuIAyBTKUUCcIwLwwG0ByAQSIBoYiAhIgXQG4BYAKFYHp2ZRJYoALAJaYAJqnRYAXDGiZBYAOase0OENHiMmPHESasEAgCZGrDlxV91YtFpJRps+QpgAfGAFcwIlADN5KCLK4KoCwjYSmPY6CMi2BgB0AIZQABRGAJRAA
        const subRank = taxonomicRanks.at(taxonomicRanks.indexOf(rank) + 1);
        return (
          // For those unfamilar with the element
          // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
          <details open>
            <summary>
              {taxon[rank]}
            </summary>
            {/* Should a subRank exist then render our taxonomy */}
            {/* The element calls itself */}
            {subRank && <Taxonomy rank={subRank}>{childrenOfTaxon}</Taxonomy>}
          </details>
        );
      })}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      {/* Our initial call to our Taxonomy */}
      <Taxonomy rank={taxonomicRanks[0]}>{allTrees}</Taxonomy>
    </div>
  );
}

export default App;
