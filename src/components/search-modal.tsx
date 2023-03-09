import React, { useEffect, useState } from "react";
import {
  Accordion,
  Button,
  Form,
  InputGroup,
  ListGroup,
  Modal,
} from "react-bootstrap";
import { AccordionEventKey } from "react-bootstrap/esm/AccordionContext";
import { requestCategories } from "../reference-data/requests-categories";

type Props = {
  show: boolean;
  onHide: () => void;
  setRequest: React.Dispatch<React.SetStateAction<string | undefined>>;
};

interface RequestCategory {
  category: string;
  items: RequestItem[];
}

interface RequestItem {
  name: string;
  requestType: string;
}

const SearchModal = ({ show, onHide, setRequest }: Props) => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [activeKeyAccordionCategory, setActiveKeyAccordionCategory] =
    useState("");
  const [filteredRequests, setFilteredRequests] =
    useState<RequestCategory[]>(requestCategories);

  const handleOnClickItem = (requestItemType: string) => {
    setRequest(requestItemType);
    onHide();
  };

  useEffect(() => {
    const categoryList: RequestCategory[] = [];
    for (const category of requestCategories) {
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
        <Form onSubmit={() => {}}>
          <InputGroup>
            <Form.Control
              title="Type to show content bellow"
              placeholder="type to search"
              name="search_value"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </InputGroup>
        </Form>
      </Modal.Header>
      <Modal.Body>
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
                          onClick={() => handleOnClickItem(catItem.requestType)}
                          key={catItem.requestType}
                        >
                          {catItem.name}
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
