import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Container, Navbar, Form, Button, Alert, Stack } from "react-bootstrap";
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
  const [duplication, setDuplication] = useState<boolean>(false);

  const search = (data: string[][]) => {
    const reduced = data.reduce((accumulator, currentValue) => {
      if (searchText.trim() === "") {
        accumulator.push(currentValue[0]);
      }
      else if (currentValue[2].includes(searchText.trim())) {
        accumulator.push(currentValue[0]);
      }
      return accumulator;
    }, []);
    const setElements = new Set(reduced);
    setDuplication(setElements.size !== reduced.length);
    setReault(reduced);
  }

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
        search(results.data.slice(1));
      },
    });
  };

  const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setSearchText("");
      return;
    }
    setSearchText(e.target.value);
  };

  const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (file) {
      search(tweets);
    }
  };

  return (
    <>
      <header>
        <Navbar expand="lg" bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#">Tweet Conter Static</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <a href="https://github.com/Ryoga-exe/tweet-counter-static">GitHub</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
      <Container>
        <h1 className="mt-4">Count tweets from tweet activity metrics</h1>
        <Stack gap={3}>
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
          <Stack>
            <Alert variant="info">
              {!file ? <>ファイルを選択してください</> : result.length > 0 ? <>{result.length}件見つかりました</> : <>見つかりませんでした</>}
            </Alert>
            {
              file && result.length > 0 && (
                duplication && <Alert variant="warning">データに重複があります</Alert>
              )
            }
          </Stack>
        </Stack>
        {result.map((i) => {
          return <Tweet id={i} key={i} />;
        })}
      </Container>
    </>
  );
}

export default PageIndex;
