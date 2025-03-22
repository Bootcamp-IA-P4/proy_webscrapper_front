import ListDensidad from "./components/listTopDensidad";
import ListPoblacion from "./components/listTopPoblacion";
import ListPueblos from "./components/listPueblos";

function HomePage(){
  return(
    <div>
      <h1>Home Page</h1> 

      <ListDensidad />
      
      <ListPoblacion />

      <ListPueblos />
    </div>
  )
}

export default HomePage