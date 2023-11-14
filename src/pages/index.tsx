import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Container, Navbar, Form, Button, Alert, Stack, InputGroup } from "react-bootstrap";
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
  const [startDate, setStartDate] = useState<string>(query.get("startDate") || "");
  const [startTime, setStartTime] = useState<string>(query.get("startTime") || "");
  const [endDate, setEndDate] = useState<string>(query.get("endDate") || "");
  const [endTime, setEndTime] = useState<string>(query.get("endTime") || "");

  const search = (data: string[][]) => {
    const startDateTime = new Date(startDate + " " + startTime === "" ? "00:00" : startTime);
    const endDateTime = new Date(endDate + " " + endTime === "" ? "00:00" : endTime);
    const reduced = data.reduce((accumulator, currentValue) => {
      const tweetDateTime = new Date(currentValue[3]);
      let check = true;
      if (searchText.trim() !== "" && !currentValue[2].includes(searchText.trim())) {
        check = false;
      }
      if (startDateTime && startDateTime > tweetDateTime) {
        check = false;
      }
      if (endDateTime && endDateTime < tweetDateTime) {
        check = false;
      }
      if (check) {
        accumulator.push(currentValue[0]);
      }
      return accumulator;
    }, []);
    const setElements = new Set(reduced);
    setDuplication(setElements.size !== reduced.length);
    setReault(reduced);
  };

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
            <Navbar.Text className="justify-content-end">
              <a href="https://github.com/Ryoga-exe/tweet-counter-static">GitHub</a>
            </Navbar.Text>
          </Container>
        </Navbar>
      </header>
      <Container>
        <h1 className="mt-4">Count tweets from tweet activity metrics</h1>
        <Stack gap={3}>
          <Form>
            <Form.Group className="mb-3" controlId="form.file">
              <Form.Label>CSV ファイルを選択</Form.Label>
              <Form.Control type="file" accept=".csv" onChange={handleOnChangeFile} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="from.searchText">
              <Form.Label>検索する文字列を入力</Form.Label>
              <Form.Control
                type="text"
                value={searchText}
                placeholder="#コンテンツ入門2023"
                onChange={handleOnChangeSearch}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="form.date">
              <Form.Label>検索する日時の範囲を入力 (空欄で全範囲を検索)</Form.Label>
              <InputGroup className="mb-3">
                <Form.Control
                  type="date"
                  aria-label="Start Date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
                <Form.Control
                  type="time"
                  aria-label="Start Time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                />
                <InputGroup.Text>から</InputGroup.Text>
                <Form.Control
                  type="date"
                  aria-label="End Date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
                <Form.Control
                  type="time"
                  aria-label="End Time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                />
              </InputGroup>
            </Form.Group>
            <Button as="input" type="submit" value="Submit" onClick={handleOnSubmit} />
          </Form>
          <Stack>
            <Alert variant="info">
              {!file ? (
                <>ファイルを選択してください</>
              ) : result.length > 0 ? (
                <>{result.length}件見つかりました</>
              ) : (
                <>見つかりませんでした</>
              )}
            </Alert>
            {file && result.length > 0 && duplication && <Alert variant="warning">データに重複があります</Alert>}
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
