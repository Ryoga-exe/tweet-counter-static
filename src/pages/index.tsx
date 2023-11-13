import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Container, Navbar, Form, Button } from "react-bootstrap";
import Papa from "papaparse";
import { Tweet } from "react-tweet";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

function PageIndex() {
  const query = useQuery();

  const [file, setFile] = useState<File>();
  const [result, setReault] = useState<string[]>([]);
  const [tweets, setTweets] = useState<string[][]>([]);
  const [searchText, setSearchText] = useState(query.get("searchText") || "");

  const handleOnChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return;
    }
    setFile(e.target.files[0]);
    Papa.parse(e.target.files[0], {
      header: false,
      skipEmptyLines: true,
      complete: function (results: { data: string[][] }) {
        setTweets(results.data.slice(1));
      },
    });
  };

  const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      return;
    }
    setSearchText(e.target.value);
  };

  const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (file) {
      const reduced = tweets.reduce((accumulator, currentValue) => {
        if (currentValue[2].includes(searchText.trim())) {
          accumulator.push(currentValue[0]);
        }
        return accumulator;
      }, []);
      setReault(reduced);
    }
  };

  return (
    <>
      <header>
        <Navbar expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#">Tweet Conter Static</Navbar.Brand>
          </Container>
        </Navbar>
      </header>
      <Container>
        <h1 className="mt-4">Count tweets from tweet activity metrics</h1>
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>CSV ファイルを選択</Form.Label>
            <Form.Control type="file" accept=".csv" onChange={handleOnChangeFile} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>検索する文字列を入力</Form.Label>
            <Form.Control
              type="text"
              value={searchText}
              placeholder="#コンテンツ入門2023"
              onChange={handleOnChangeSearch}
            />
          </Form.Group>
          <Button as="input" type="submit" value="Submit" onClick={handleOnSubmit} />
        </Form>
        {result.length > 0 ? <p>{result.length}件見つかりました</p> : <p>見つかりませんでした</p>}
        {result.map((i) => {
          return <Tweet id={i} key={i} />;
        })}
      </Container>
    </>
  );
}

export default PageIndex;
