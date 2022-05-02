import "./App.css";
import { FC } from "react";
import allTrees from "./data.json";

// Types
type Tree = typeof allTrees[number];
type TaxonomicRank = keyof Tree;
// domain, kingdom, phylum, class, order, family, genus, species
type TaxonomyProps = { children: Array<Tree>; rank: TaxonomicRank }

const taxonomicRanks: Array<TaxonomicRank> = [
  "Kingdom",
  "Order",
  "Family",
  "Genus",
];

// Our recursive taxonomy which calls itself when child taxonomies exist for it
const Taxonomy: FC<TaxonomyProps> = (props) => {
  const { children, rank } = props;

  // Find the unique taxa in our child taxonomies
  const taxaInRank = children.reduce<Array<Tree>>((a, c) => {
    if (a.find((v) => v[rank] === c[rank])) {
      return a;
    }
    return [...a, c];
  }, []);

  return (
    <div title={rank}>
      {taxaInRank.map((taxon) => {
        const childrenOfTaxon = children.filter(
          (t) => t[rank] === taxon[rank]
        );
        const subRank = taxonomicRanks[taxonomicRanks.indexOf(rank) + 1];
        return (
          <details open>
            <summary>
              {taxon[rank]}
            </summary>
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
      <Taxonomy rank={taxonomicRanks[0]}>{allTrees}</Taxonomy>
    </div>
  );
}

export default App;
