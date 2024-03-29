import { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Nav,
} from "react-bootstrap";
import { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import { LinkContainer } from "react-router-bootstrap";
import { requestCategories } from "../reference-data/requests-categories";
import { Utils } from "../utils/utils";

type Props = {
  show: boolean;
  onHide: () => void;
};

interface RequestCategory {
  category: string;
  items: RequestItem[];
}

interface RequestItem {
  name: string;
  requestType: string;
}

const SearchModal = ({ show, onHide }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [activeKeyAccordionCategory, setActiveKeyAccordionCategory] =
    useState("");
  const [filteredRequests, setFilteredRequests] =
    useState<RequestCategory[]>(requestCategories);

  useEffect(() => {
    const categoryList: RequestCategory[] = [];
    const orderedRequestCategories = requestCategories.sort((a, b) =>
      Utils.sortByKeyNames(a, b, "category")
    );
    for (const category of orderedRequestCategories) {
      const itemList: RequestItem[] = [];
      for (const item of category.items) {
        if (item.name.toLowerCase().includes(searchValue.toLowerCase())) {
          itemList.push(item);
        }
      }
      if (itemList.length > 0) {
        categoryList.push({ category: category.category, items: itemList });
      }
    }
    setFilteredRequests(categoryList);
  }, [searchValue]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Search Keychain Request </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={() => {}}>
          <InputGroup className="mb-2">
            <Form.Control
              title="Type to show content bellow"
              placeholder="Search"
              name="search_value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              autoFocus
            />
          </InputGroup>
        </Form>
        <Accordion
          activeKey={activeKeyAccordionCategory}
          onSelect={(e: AccordionEventKey) =>
            setActiveKeyAccordionCategory(e as string)
          }
        >
          {filteredRequests.map((cat, index) => {
            return (
              <Accordion.Item
                eventKey={index.toString()}
                key={cat.category + index}
              >
                <Accordion.Header>{cat.category}</Accordion.Header>
                <Accordion.Body>
                  <ListGroup>
                    {cat.items.map((catItem) => {
                      return (
                        <ListGroup.Item
                          action
                          onClick={() => onHide()}
                          key={catItem.requestType}
                        >
                          <LinkContainer to={`/request/${catItem.requestType}`}>
                            <Nav.Link>{catItem.name}</Nav.Link>
                          </LinkContainer>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchModal;
